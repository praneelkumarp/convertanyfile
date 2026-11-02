import { useState } from "react";
import { ArrowRight, Download, Loader2, AlertTriangle, Info } from "lucide-react";
import { getConversionOptions, ConversionOption } from "@/utils/conversionMap";
import { DetectedFile } from "@/utils/fileDetection";
import { PrivacyBadge } from "./PrivacyBadge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

import { pdfToImages } from "@/engines/pdfToImages";
import { pdfToText, NoTextFoundError } from "@/engines/pdfToText";
import { convertDocxToPdf } from "@/engines/docxToPdf";
import { convertDocxToHtml } from "@/engines/docxToHtml";
import { convertDocxToText } from "@/engines/docxToText";
import { convertXlsxToCsv } from "@/engines/xlsxToCsv";
import { extractZip } from "@/engines/zipExtract";
import { imageToPdf } from "@/engines/imageToPdf";

import {
  convertImageFormat,
  downloadFile,
  downloadAsZip,
} from "@/utils/clientConversions";

interface ConversionOptionsProps {
  file: File;
  detected: DetectedFile;
}

type Result = {
  success: boolean;
  files: { blob: Blob; name: string }[];
};

export const ConversionOptions = ({ file, detected }: ConversionOptionsProps) => {
  const options = getConversionOptions(detected.extension);
  const [converting, setConverting] = useState(false);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleConvert = async (option: ConversionOption) => {
    if (!option.clientCapable) {
      toast.error("This conversion requires server-side processing (disabled).");
      return;
    }

    setConverting(true);
    setActiveTarget(option.target);
    setProgress({ current: 0, total: 0 });

    try {
      let result: Result | undefined;

      // ============================================================
      // PDF → PNG/JPG
      // ============================================================
      if (
        detected.extension === "pdf" &&
        (option.target === "png" || option.target === "jpg")
      ) {
        result = await pdfToImages(file, option.target, (current, total) => {
          setProgress({ current, total });
        });
      }

      // ============================================================
      // PDF → TEXT
      // ============================================================
      else if (detected.extension === "pdf" && option.target === "txt") {
        const blob = await pdfToText(file);
        result = {
          success: true,
          files: [{ blob, name: file.name.replace(/\.pdf$/i, ".txt") }],
        };
      }

      // ============================================================
      // IMAGE → IMAGE
      // ============================================================
      else if (
        ["png", "jpg", "jpeg", "webp"].includes(detected.extension) &&
        ["png", "jpg", "webp"].includes(option.target)
      ) {
        const r = await convertImageFormat(
          file,
          option.target as "png" | "jpg" | "webp"
        );
        if (!r.success) throw new Error(r.error || "Image conversion failed");
        result = { success: true, files: r.files };
      }

      // ============================================================
      // IMAGE → PDF
      // ============================================================
      else if (
        ["png", "jpg", "jpeg", "webp"].includes(detected.extension) &&
        option.target === "pdf"
      ) {
        const blob = await imageToPdf(file);
        result = {
          success: true,
          files: [
            { blob, name: file.name.replace(/\.\w+$/, ".pdf") },
          ],
        };
      }

      // ============================================================
      // DOCX → HTML
      // ============================================================
      else if (detected.extension === "docx" && option.target === "html") {
        const blob = await convertDocxToHtml(file);
        result = {
          success: true,
          files: [{ blob, name: file.name.replace(/\.docx$/i, ".html") }],
        };
      }

      // ============================================================
      // DOCX → TEXT
      // ============================================================
      else if (detected.extension === "docx" && option.target === "txt") {
        const blob = await convertDocxToText(file);
        result = {
          success: true,
          files: [{ blob, name: file.name.replace(/\.docx$/i, ".txt") }],
        };
      }

      // ============================================================
      // DOCX → PDF
      // ============================================================
      else if (detected.extension === "docx" && option.target === "pdf") {
        const blob = await convertDocxToPdf(file);
        result = {
          success: true,
          files: [{ blob, name: file.name.replace(/\.docx$/i, ".pdf") }],
        };
      }

      // ============================================================
      // XLSX → CSV
      // ============================================================
      else if (detected.extension === "xlsx" && option.target === "csv") {
        const blob = await convertXlsxToCsv(file);
        result = {
          success: true,
          files: [{ blob, name: file.name.replace(/\.xlsx$/i, ".csv") }],
        };
      }

      // ============================================================
      // ZIP → Extract
      // ============================================================
      else if (detected.extension === "zip" && option.target === "extract") {
        result = await extractZip(file);
      } else {
        throw new Error(
          `Conversion not implemented: ${detected.extension} → ${option.target}`
        );
      }

      // ============================================================
      // DOWNLOAD RESULT
      // ============================================================
      if (result && result.success && result.files.length > 0) {
        if (result.files.length === 1) {
          downloadFile(result.files[0].blob, result.files[0].name);
        } else {
          // For ZIP extraction, re-zipping is silly — but for PDF→PNG/JPG batches,
          // a single ZIP download is the spec-required UX.
          // For ZIP extract, we offer the same convenience (one download instead of N prompts).
          const baseName = file.name.replace(/\.\w+$/, "");
          await downloadAsZip(result.files, `${baseName}_converted.zip`);
        }
        toast.success("Conversion completed!");
      } else {
        throw new Error("No output produced");
      }
    } catch (err: any) {
      const message = err?.message || "Conversion failed";
      toast.error(message);
      console.error("[ConvertAnyFile] Conversion error:", err);
    } finally {
      setConverting(false);
      setActiveTarget(null);
      setProgress({ current: 0, total: 0 });
    }
  };

  if (options.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>No conversion options available for this file type.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Conversions</h3>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const isActive = converting && activeTarget === option.target;
          const warning = option.fidelityWarning;
          return (
            <Card key={index} className="p-4 hover:shadow">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">
                      {detected.extension.toUpperCase()}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-semibold text-primary">
                      {option.label}
                    </span>
                    <PrivacyBadge
                      type={option.clientCapable ? "client" : "server"}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                  {isActive && progress.total > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Page {progress.current} / {progress.total}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleConvert(option)}
                  disabled={converting}
                  className="ml-4"
                >
                  {isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Convert
                </Button>
              </div>

              {/* Fidelity warning callout — surfaces known limitations honestly */}
              {warning && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    warning.severity === "warning"
                      ? "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300"
                      : "border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {warning.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{warning.title}</div>
                      <p className="text-xs leading-relaxed opacity-90">
                        {warning.message}
                      </p>
                      {warning.recommendation && (
                        <p className="text-xs leading-relaxed opacity-90 italic">
                          <span className="font-medium not-italic">Tip: </span>
                          {warning.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
