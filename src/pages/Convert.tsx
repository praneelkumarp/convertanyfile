import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolGuide } from "@/components/ToolGuide";
import { FileUploadWidget } from "@/components/FileUploadWidget";
import { ConversionOptions } from "@/components/ConversionOptions";
import { DetectedFile } from "@/utils/fileDetection";
import { Shield } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

const Convert = () => {
  const [fileData, setFileData] = useState<{ file: File; detected: DetectedFile } | null>(null);

  const handleFileDetected = (file: File, detected: DetectedFile) => {
    setFileData({ file, detected });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Convert Your Files
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Upload your file and convert it to any supported format. All processing happens on your device by default.
            </p>

            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-success/10 text-success border border-success/20">
              <Shield className="h-4 w-4 shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                Your files never leave your device
              </span>
            </div>
          </div>

          {/* Header ad slot — non-intrusive */}
          <AdSlot
            slot={import.meta.env.VITE_ADSENSE_SLOT_HEADER || ""}
            format="horizontal"
            className="my-4"
          />

          <FileUploadWidget onFileDetected={handleFileDetected} />

          {fileData && (
            <div className="animate-in fade-in duration-500">
              <ConversionOptions file={fileData.file} detected={fileData.detected} />
            </div>
          )}

          <ToolGuide path="/convert" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Convert;
