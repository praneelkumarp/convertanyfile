// Client-side conversion implementations
// IMPORTANT: This module is imported eagerly by ConversionOptions.tsx.
// We deliberately do NOT touch GlobalWorkerOptions here — each engine
// that needs pdfjs configures the worker locally via ?url import.
// Touching it here would override the local worker set by engines and
// re-introduce CDN/version-mismatch errors.

import JSZip from "jszip";

export interface ConversionResult {
  success: boolean;
  files: { blob: Blob; name: string }[];
  error?: string;
}

// Image format conversion (canvas-based)
export async function convertImageFormat(
  file: File,
  targetFormat: "png" | "jpg" | "webp"
): Promise<ConversionResult> {
  try {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    // For JPEG output, flatten transparency against white background
    if (targetFormat === "jpg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const mimeType = targetFormat === "jpg" ? "image/jpeg" : `image/${targetFormat}`;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create image blob"));
        },
        mimeType,
        0.95
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return {
      success: true,
      files: [{ blob, name: `${baseName}.${targetFormat}` }],
    };
  } catch (error) {
    return {
      success: false,
      files: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Single file download helper
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Bundle multiple files into a real ZIP and trigger a single download
export async function downloadAsZip(
  files: { blob: Blob; name: string }[],
  zipName: string
) {
  const zip = new JSZip();
  for (const f of files) {
    zip.file(f.name, f.blob);
  }
  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  const safeName = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`;
  downloadFile(zipBlob, safeName);
}
