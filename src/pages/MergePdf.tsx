import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ArrowUp, ArrowDown, X, Loader2, Shield, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { mergePdfs, buildMergedFilename } from "@/engines/mergePdfs";

const MAX_FILES = 5;

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (incoming: FileList | null) => {
    if (!incoming) return;

    const newPdfs: File[] = [];
    let rejectedCount = 0;

    Array.from(incoming).forEach((f) => {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        newPdfs.push(f);
      } else {
        rejectedCount++;
      }
    });

    if (rejectedCount > 0) {
      toast.error(`${rejectedCount} non-PDF file(s) skipped. Only PDF files can be merged.`);
    }

    if (newPdfs.length === 0) return;

    const combined = [...files, ...newPdfs];
    if (combined.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} PDFs per merge. Keeping the first ${MAX_FILES}.`);
      setFiles(combined.slice(0, MAX_FILES));
    } else {
      setFiles(combined);
    }
  };

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...files];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFiles(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFiles(updated);
  };

  const handleClear = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDFs to merge.");
      return;
    }

    setMerging(true);
    setProgress({ current: 0, total: files.length, name: "" });

    try {
      const mergedBlob = await mergePdfs(files, (p) => {
        setProgress({ current: p.current, total: p.total, name: p.currentFileName });
      });

      // Trigger download
      const filename = buildMergedFilename();
      const url = URL.createObjectURL(mergedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast.success(`Merged ${files.length} PDFs into ${filename}`);
    } catch (err: any) {
      const message = err?.message || "Merge failed. Please try again.";
      toast.error(message);
      console.error("[ConvertAnyFile] Merge error:", err);
    } finally {
      setMerging(false);
      setProgress(null);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Merge <span className="text-gradient">PDFs</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Combine up to {MAX_FILES} PDFs into a single file — all processed locally in your browser.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
              <Shield className="h-3.5 w-3.5 inline" />
              <span>Files never leave your device</span>
            </p>
          </div>

          {/* Drop zone */}
          {files.length === 0 ? (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8 sm:p-12 text-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Drop PDFs here</h2>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse — up to {MAX_FILES} files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFilesAdded(e.target.files)}
              />
            </Card>
          ) : (
            <Card className="p-4 sm:p-6 space-y-4">
              {/* File list */}
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border"
                  >
                    {/* Reorder controls */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || merging}
                        aria-label={`Move ${file.name} up`}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === files.length - 1 || merging}
                        aria-label={`Move ${file.name} down`}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Position indicator */}
                    <div className="text-xs font-semibold text-muted-foreground w-6 text-center shrink-0">
                      {index + 1}
                    </div>

                    {/* File info */}
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{formatBytes(file.size)}</div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      disabled={merging}
                      aria-label={`Remove ${file.name}`}
                      className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add more / clear */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                {files.length < MAX_FILES && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={merging}
                    className="text-xs sm:text-sm"
                  >
                    <FilePlus2 className="h-4 w-4 mr-1.5" />
                    Add more ({files.length}/{MAX_FILES})
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={merging}
                  className="text-xs sm:text-sm"
                >
                  Clear all
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesAdded(e.target.files)}
                />
              </div>

              {/* Progress (while merging) */}
              {merging && progress && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>
                      Merging {progress.current} of {progress.total}: {progress.name}
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

              {/* Merge button */}
              <Button
                type="button"
                onClick={handleMerge}
                disabled={merging || files.length < 2}
                size="lg"
                className="w-full gradient-primary text-white text-base font-semibold min-h-[48px]"
              >
                {merging ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Merging…
                  </>
                ) : files.length < 2 ? (
                  <>Add at least 2 PDFs to merge</>
                ) : (
                  <>Merge {files.length} PDFs & Download</>
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
                  PDF merging happens entirely in your browser. Nothing is uploaded to any server.
                  Use the arrows to reorder PDFs before merging.
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

export default MergePdf;
