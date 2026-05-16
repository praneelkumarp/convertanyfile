import { useCallback, useState } from "react";
import { Upload, File as FileIcon, X } from "lucide-react";
import { detectFileType, formatFileSize, DetectedFile } from "@/utils/fileDetection";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface FileUploadWidgetProps {
  onFileDetected: (file: File, detected: DetectedFile) => void;
}

export const FileUploadWidget = ({ onFileDetected }: FileUploadWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ file: File; detected: DetectedFile } | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const detected = await detectFileType(file);
      setSelectedFile({ file, detected });
      onFileDetected(file, detected);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            isProcessing && "opacity-50 pointer-events-none"
          )}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="gradient-primary p-4 rounded-full">
              <Upload className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {isProcessing ? "Processing file..." : "Drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse from your device
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success">
                🔒 Files never leave your device
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-2xl p-6 bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="gradient-primary p-3 rounded-lg">
                <FileIcon className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {selectedFile.detected.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedFile.detected.type}
                  </span>
                  <span>•</span>
                  <span>{formatFileSize(selectedFile.detected.size)}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                  <span className="font-semibold uppercase">
                    {selectedFile.detected.extension}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
