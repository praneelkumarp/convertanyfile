import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, Shield, Scissors, Files } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getPdfPageCount,
  parsePageRanges,
  extractPages,
  splitEveryPage,
  buildExtractedFilename,
  buildSplitZipFilename,
} from "@/engines/splitPdf";

type SplitMode = "extract" | "every";

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [ranges, setRanges] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdded = async (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;

    const f = incoming[0];
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Only PDF files can be split.");
      return;
    }
    if (incoming.length > 1) {
      toast.error("One PDF at a time. Using the first file.");
    }

    setLoadingFile(true);
    try {
      const count = await getPdfPageCount(f);
      setFile(f);
      setPageCount(count);
      setRanges(count > 1 ? `1-${Math.min(count, 3)}` : "1");
    } catch (err: any) {
      toast.error(err?.message || "Could not read this PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setLoadingFile(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
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

  const handleSplit = async () => {
    if (!file || !pageCount) return;

    setSplitting(true);
    try {
      if (mode === "extract") {
        const indices = parsePageRanges(ranges, pageCount);
        const blob = await extractPages(file, indices);
        const filename = buildExtractedFilename(file.name);
        downloadBlob(blob, filename);
        toast.success(`Extracted ${indices.length} page${indices.length === 1 ? "" : "s"} into ${filename}`);
      } else {
        setProgress({ current: 0, total: pageCount });
        const blob = await splitEveryPage(file, (p) => setProgress(p));
        const filename = buildSplitZipFilename(file.name);
        downloadBlob(blob, filename);
        toast.success(`Split into ${pageCount} PDFs in ${filename}`);
      }
    } catch (err: any) {
      const message = err?.message || "Split failed. Please try again.";
      toast.error(message);
      console.error("[ConvertAnyFile] Split error:", err);
    } finally {
      setSplitting(false);
      setProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileAdded(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const modeOptions: { value: SplitMode; label: string; description: string; icon: typeof Scissors }[] = [
    { value: "extract", label: "Extract pages", description: "Pick pages into one new PDF", icon: Scissors },
    { value: "every", label: "Split every page", description: "One PDF per page, as a ZIP", icon: Files },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Split <span className="text-gradient">PDF</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Extract the pages you need or split every page into its own file — all processed locally in your browser.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
              <Shield className="h-3.5 w-3.5 inline" />
              <span>Files never leave your device</span>
            </p>
          </div>

          {/* Drop zone */}
          {!file ? (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8 sm:p-12 text-center"
              onClick={() => !loadingFile && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {loadingFile ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-white" />
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                {loadingFile ? "Reading PDF…" : "Drop a PDF here"}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => handleFileAdded(e.target.files)}
              />
            </Card>
          ) : (
            <Card className="p-4 sm:p-6 space-y-5">
              {/* File info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatBytes(file.size)} · {pageCount} page{pageCount === 1 ? "" : "s"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={splitting}
                  aria-label={`Remove ${file.name}`}
                  className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mode selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Split mode">
                {modeOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = mode === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setMode(option.value)}
                      disabled={splitting}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border text-left transition-colors disabled:opacity-50",
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Page ranges input */}
              {mode === "extract" && (
                <div className="space-y-1.5">
                  <label htmlFor="page-ranges" className="text-sm font-medium">
                    Pages to extract
                  </label>
                  <input
                    id="page-ranges"
                    type="text"
                    inputMode="numeric"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSplit()}
                    disabled={splitting}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate pages and ranges with commas. Pages are saved in the order you type them.
                  </p>
                </div>
              )}

              {/* Progress (while splitting every page) */}
              {splitting && progress && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>
                      Splitting page {progress.current} of {progress.total}
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

              {/* Split button */}
              <Button
                type="button"
                onClick={handleSplit}
                disabled={splitting || (mode === "extract" && !ranges.trim())}
                size="lg"
                className="w-full gradient-primary text-white text-base font-semibold min-h-[48px]"
              >
                {splitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Splitting…
                  </>
                ) : mode === "extract" ? (
                  <>Extract Pages & Download</>
                ) : (
                  <>Split into {pageCount} PDFs & Download ZIP</>
                )}
              </Button>
            </Card>
          )}

          {/* Info card */}
          <Card className="p-4 sm:p-5 bg-card/50 border-dashed">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">100% private — files stay on your device</p>
                <p className="text-xs">
                  PDF splitting happens entirely in your browser. Nothing is uploaded to any server.
                  Pages are copied exactly, with no loss in quality. Need to combine PDFs instead?{" "}
                  <Link to="/merge-pdf" className="underline hover:text-foreground">
                    Merge PDFs
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SplitPdf;
