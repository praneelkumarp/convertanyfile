import JSZip from "jszip";

// File type detection result interface
export interface DetectedFile {
  type: string;
  extension: string;
  mimeType: string;
  size: number;
  name: string;
}

// Magic bytes signatures
const MAGIC_BYTES: Record<
  string,
  { bytes: number[]; offset?: number; type: string; ext: string }
> = {
  pdf: { bytes: [0x25, 0x50, 0x44, 0x46], type: "PDF Document", ext: "pdf" },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], type: "PNG Image", ext: "png" },
  jpg: { bytes: [0xff, 0xd8, 0xff], type: "JPEG Image", ext: "jpg" },
  gif: { bytes: [0x47, 0x49, 0x46, 0x38], type: "GIF Image", ext: "gif" },
  // WEBP: "RIFF" at offset 0, "WEBP" at offset 8 — verify both
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], type: "WebP Image", ext: "webp" },
  // ZIP-like (DOCX, PPTX, XLSX, EPUB, plain ZIP)
  zip: { bytes: [0x50, 0x4b, 0x03, 0x04], type: "ZIP Archive", ext: "zip" },
};

async function readFirstBytes(file: File, count: number = 16): Promise<Uint8Array> {
  // Slice only — does NOT load the full file
  const buffer = await file.slice(0, count).arrayBuffer();
  return new Uint8Array(buffer);
}

function matchMagic(
  bytes: Uint8Array,
  sig: { bytes: number[]; offset?: number }
): boolean {
  const offset = sig.offset || 0;
  return sig.bytes.every((b, i) => bytes[offset + i] === b);
}

function isZipSignature(bytes: Uint8Array): boolean {
  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  );
}

function isWebpSignature(bytes: Uint8Array): boolean {
  // "RIFF" + 4 bytes size + "WEBP"
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

// Only called once a ZIP signature is confirmed.
// JSZip.loadAsync(File) streams from the Blob — it does not need a full ArrayBuffer.
async function detectOOXMLFromZip(file: File): Promise<DetectedFile> {
  try {
    const zip = await JSZip.loadAsync(file);

    if (zip.files["word/document.xml"]) {
      return {
        type: "Microsoft Word Document (DOCX)",
        extension: "docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: file.size,
        name: file.name,
      };
    }

    if (zip.files["ppt/presentation.xml"]) {
      return {
        type: "Microsoft PowerPoint Presentation (PPTX)",
        extension: "pptx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        size: file.size,
        name: file.name,
      };
    }

    if (zip.files["xl/workbook.xml"]) {
      return {
        type: "Microsoft Excel Spreadsheet (XLSX)",
        extension: "xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: file.size,
        name: file.name,
      };
    }

    if (zip.files["mimetype"]) {
      const mimeFile = await zip.files["mimetype"].async("string");
      if (mimeFile.includes("application/epub+zip")) {
        return {
          type: "EPUB eBook",
          extension: "epub",
          mimeType: "application/epub+zip",
          size: file.size,
          name: file.name,
        };
      }
    }

    return {
      type: "ZIP Archive",
      extension: "zip",
      mimeType: "application/zip",
      size: file.size,
      name: file.name,
    };
  } catch {
    // Corrupt or partial ZIP — fall back to plain ZIP classification
    return {
      type: "ZIP Archive",
      extension: "zip",
      mimeType: "application/zip",
      size: file.size,
      name: file.name,
    };
  }
}

// MAIN ENTRY FUNCTION
export async function detectFileType(file: File): Promise<DetectedFile> {
  const bytes = await readFirstBytes(file, 16);

  // Check ZIP first (DOCX/PPTX/XLSX/EPUB)
  if (isZipSignature(bytes)) {
    return detectOOXMLFromZip(file);
  }

  // Check WEBP (needs offset-8 check)
  if (isWebpSignature(bytes)) {
    return {
      type: "WebP Image",
      extension: "webp",
      mimeType: "image/webp",
      size: file.size,
      name: file.name,
    };
  }

  // Other magic byte signatures
  for (const [key, signature] of Object.entries(MAGIC_BYTES)) {
    if (key === "zip" || key === "webp") continue;
    if (matchMagic(bytes, signature)) {
      return {
        type: signature.type,
        extension: signature.ext,
        mimeType: file.type || `application/${signature.ext}`,
        size: file.size,
        name: file.name,
      };
    }
  }

  // Fallback to filename extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "unknown";
  return {
    type: file.type || "Unknown File",
    extension: ext,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    name: file.name,
  };
}

// Utility for UI
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}
