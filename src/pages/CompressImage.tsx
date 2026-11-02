import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolGuide } from "@/components/ToolGuide";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, ImageIcon, X, Loader2, Shield, FilePlus2, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  compressImage,
  isSupportedImage,
  buildImagesZip,
  buildImagesZipFilename,
  type CompressResult,
  type OutputFormat,
} from "@/engines/compressImages";

const MAX_FILES = 20;

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "original", label: "Same as original" },
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png", label: "PNG" },
];

const RESIZE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Keep original size" },
  { value: "3840", label: "Max 3840 px (4K)" },
  { value: "2560", label: "Max 2560 px" },
  { value: "1920", label: "Max 1920 px (Full HD)" },
  { value: "1280", label: "Max 1280 px" },
  { value: "800", label: "Max 800 px" },
];

interface Item {
  file: File;
  result?: CompressResult;
  error?: string;
}

const CompressImage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(75);
  const [maxDimension, setMaxDimension] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasResults = items.some((item) => item.result);
  const hasPngInput = items.some((item) => /png$/i.test(item.file.type || item.file.name));
  const qualityApplies = format !== "image/png";

  // Any settings change makes previous results stale
  const clearResults = () => setItems((prev) => prev.map(({ file }) => ({ file })));

  const handleFilesAdded = (incoming: FileList | null) => {
    if (!incoming) return;

    const newImages: File[] = [];
    let rejectedCount = 0;

    Array.from(incoming).forEach((f) => {
      if (isSupportedImage(f)) {
        newImages.push(f);
      } else {
        rejectedCount++;
      }
    });

    if (rejectedCount > 0) {
      toast.error(`${rejectedCount} file(s) skipped. Only JPG, PNG and WebP images are supported.`);
    }

    if (newImages.length === 0) return;

    const combined = [...items.map(({ file }) => ({ file })), ...newImages.map((file) => ({ file }))];
    if (combined.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} images at a time. Keeping the first ${MAX_FILES}.`);
      setItems(combined.slice(0, MAX_FILES));
    } else {
      setItems(combined);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setItems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleCompress = async () => {
    if (items.length === 0) return;

    setCompressing(true);
    const options = {
      format,
      quality: quality / 100,
      maxDimension: maxDimension ? parseInt(maxDimension, 10) : null,
    };

    const updated: Item[] = [];
    for (let i = 0; i < items.length; i++) {
      const { file } = items[i];
      setProgress({ current: i + 1, total: items.length, name: file.name });
      try {
        updated.push({ file, result: await compressImage(file, options) });
      } catch (err: any) {
        console.error("[ConvertAnyFile] Compress error:", err);
        updated.push({ file, error: err?.message || "Compression failed." });
      }
    }

    setItems(updated);
    setCompressing(false);
    setProgress(null);

    const done = updated.filter((item) => item.result);
    if (done.length === 0) {
      toast.error(updated[0]?.error || "Compression failed. Please try again.");
      return;
    }

    const before = done.reduce((sum, item) => sum + item.result!.originalSize, 0);
    const after = done.reduce((sum, item) => sum + item.result!.compressedSize, 0);
    const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0;
    toast.success(
      saved > 0
        ? `Compressed ${done.length} image${done.length === 1 ? "" : "s"} — ${saved}% smaller`
        : `Done. These images were already well optimized.`
    );
  };

  const handleDownloadAll = async () => {
    const results = items.map((item) => item.result).filter((r): r is CompressResult => !!r);
    if (results.length === 1) {
      downloadBlob(results[0].blob, results[0].name);
      return;
    }
    try {
      const zip = await buildImagesZip(results);
      downloadBlob(zip, buildImagesZipFilename());
    } catch (err: any) {
      toast.error("Could not create the ZIP file. Please download images individually.");
      console.error("[ConvertAnyFile] ZIP error:", err);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const savedPercent = (result: CompressResult) =>
    Math.round((1 - result.compressedSize / result.originalSize) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Compress <span className="text-gradient">Images</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Shrink JPG, PNG and WebP images, resize them, or change their format — all processed locally in your browser.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
              <Shield className="h-3.5 w-3.5 inline" />
              <span>Files never leave your device</span>
            </p>
          </div>

          {/* Drop zone */}
          {items.length === 0 ? (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8 sm:p-12 text-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Drop images here</h2>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse — JPG, PNG or WebP, up to {MAX_FILES} files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                multiple
                className="hidden"
                onChange={(e) => handleFilesAdded(e.target.files)}
              />
            </Card>
          ) : (
            <Card className="p-4 sm:p-6 space-y-5">
              {/* File list */}
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border"
                  >
                    <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.result ? (
                          item.result.keptOriginal ? (
                            <>{formatBytes(item.result.originalSize)} · already optimized, kept original</>
                          ) : (
                            <>
                              {formatBytes(item.result.originalSize)} → {formatBytes(item.result.compressedSize)}
                              {" · "}
                              {item.result.width}×{item.result.height}
                            </>
                          )
                        ) : item.error ? (
                          <span className="text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            {item.error}
                          </span>
                        ) : (
                          formatBytes(item.file.size)
                        )}
                      </div>
                    </div>

                    {/* Savings badge */}
                    {item.result && !item.result.keptOriginal && (
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                          savedPercent(item.result) > 0
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {savedPercent(item.result) > 0 ? `−${savedPercent(item.result)}%` : `+${-savedPercent(item.result)}%`}
                      </span>
                    )}

                    {/* Download / remove */}
                    {item.result ? (
                      <button
                        type="button"
                        onClick={() => downloadBlob(item.result!.blob, item.result!.name)}
                        aria-label={`Download ${item.result.name}`}
                        className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        disabled={compressing}
                        aria-label={`Remove ${item.file.name}`}
                        className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add more / clear */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                {items.length < MAX_FILES && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                    className="text-xs sm:text-sm"
                  >
                    <FilePlus2 className="h-4 w-4 mr-1.5" />
                    Add more ({items.length}/{MAX_FILES})
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={compressing}
                  className="text-xs sm:text-sm"
                >
                  Clear all
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesAdded(e.target.files)}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-2 border-t border-border/50">
                {/* Output format */}
                <div className="space-y-1.5">
                  <div className="text-sm font-medium">Output format</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Output format">
                    {FORMAT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={format === option.value}
                        onClick={() => {
                          setFormat(option.value);
                          clearResults();
                        }}
                        disabled={compressing}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm transition-colors disabled:opacity-50",
                          format === option.value
                            ? "border-primary bg-primary/5 font-medium"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {hasPngInput && (format === "original" || format === "image/png") && (
                    <p className="text-xs text-muted-foreground">
                      Tip: PNG is lossless, so it barely shrinks. Choose JPG or WebP for much smaller files.
                    </p>
                  )}
                </div>

                {/* Quality */}
                {qualityApplies && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <label id="quality-label" className="font-medium">
                        Quality
                      </label>
                      <span className="text-muted-foreground tabular-nums">{quality}%</span>
                    </div>
                    <Slider
                      aria-labelledby="quality-label"
                      min={10}
                      max={100}
                      step={5}
                      value={[quality]}
                      onValueChange={([v]) => {
                        setQuality(v);
                        if (hasResults) clearResults();
                      }}
                      disabled={compressing}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower quality means smaller files. 70–80% is a good balance for photos.
                    </p>
                  </div>
                )}

                {/* Resize */}
                <div className="space-y-1.5">
                  <label htmlFor="resize" className="text-sm font-medium">
                    Resize
                  </label>
                  <select
                    id="resize"
                    value={maxDimension}
                    onChange={(e) => {
                      setMaxDimension(e.target.value);
                      clearResults();
                    }}
                    disabled={compressing}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {RESIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Limits the longest side. Smaller images are never enlarged.
                  </p>
                </div>
              </div>

              {/* Progress (while compressing) */}
              {compressing && progress && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    <span className="truncate">
                      Compressing {progress.current} of {progress.total}: {progress.name}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action button */}
              {hasResults && !compressing ? (
                <Button
                  type="button"
                  onClick={handleDownloadAll}
                  size="lg"
                  className="w-full gradient-primary text-white text-base font-semibold min-h-[48px]"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {items.filter((item) => item.result).length === 1 ? "Download Image" : "Download All (ZIP)"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleCompress}
                  disabled={compressing}
                  size="lg"
                  className="w-full gradient-primary text-white text-base font-semibold min-h-[48px]"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Compressing…
                    </>
                  ) : (
                    <>
                      Compress {items.length} Image{items.length === 1 ? "" : "s"}
                    </>
                  )}
                </Button>
              )}
            </Card>
          )}

          {/* Info card */}
          <Card className="p-4 sm:p-5 bg-card/50 border-dashed">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">100% private — files stay on your device</p>
                <p className="text-xs">
                  Image compression happens entirely in your browser. Nothing is uploaded to any server.
                  Compressed images don't keep photo metadata such as camera details or GPS location.
                </p>
              </div>
            </div>
          </Card>

          <ToolGuide path="/compress-image" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompressImage;
