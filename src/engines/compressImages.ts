/**
 * Compress and optionally resize images (JPG, PNG, WebP) by re-encoding them
 * on a canvas.
 *
 * PERFORMANCE: JSZip is dynamically imported so it only loads when a user
 * downloads several images as a ZIP.
 *
 * PRIVACY: All processing happens in the browser. Files never leave the device.
 */

export type OutputFormat = "original" | "image/jpeg" | "image/webp" | "image/png";

export interface CompressOptions {
  format: OutputFormat;
  /** 0.1 – 1. Ignored for PNG output, which is lossless. */
  quality: number;
  /** Longest side in pixels. null keeps the original dimensions. */
  maxDimension: number | null;
}

export interface CompressResult {
  blob: Blob;
  name: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  /** True when re-encoding didn't help, so the original file is returned unchanged. */
  keptOriginal: boolean;
}

const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isSupportedImage(file: File): boolean {
  return SUPPORTED_TYPES.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
}

function detectType(file: File): string {
  if (SUPPORTED_TYPES.includes(file.type)) return file.type;
  if (/\.png$/i.test(file.name)) return "image/png";
  if (/\.webp$/i.test(file.name)) return "image/webp";
  return "image/jpeg";
}

/**
 * Decode an image, honouring EXIF orientation (phone photos are often stored
 * sideways with a rotation flag).
 */
async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Fallback for browsers without createImageBitmap options support
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } catch {
      throw new Error(`Could not read "${file.name}". The file may be corrupted or not a valid image.`);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image encoding failed."))),
      type,
      quality
    );
  });
}

export async function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  const inputType = detectType(file);
  const outputType = options.format === "original" ? inputType : options.format;

  const image = await decodeImage(file);
  const sourceWidth = image.width;
  const sourceHeight = image.height;

  // Scale down so the longest side fits maxDimension (never scale up)
  const longest = Math.max(sourceWidth, sourceHeight);
  const scale = options.maxDimension && longest > options.maxDimension ? options.maxDimension / longest : 1;
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");

  // JPG has no transparency — fill white so transparent areas don't turn black
  if (outputType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);
  if ("close" in image) image.close();

  const blob = await canvasToBlob(canvas, outputType, options.quality);

  // Some browsers (older Safari) silently fall back to PNG for unsupported formats
  if (blob.type !== outputType) {
    throw new Error(`Your browser can't save ${EXTENSIONS[outputType].toUpperCase()} images. Please choose JPG instead.`);
  }

  // Same format, same size, but bigger output → the original was already well optimized
  if (outputType === inputType && scale === 1 && blob.size >= file.size) {
    return {
      blob: file,
      name: file.name,
      originalSize: file.size,
      compressedSize: file.size,
      width,
      height,
      keptOriginal: true,
    };
  }

  return {
    blob,
    name: buildCompressedFilename(file.name, outputType),
    originalSize: file.size,
    compressedSize: blob.size,
    width,
    height,
    keptOriginal: false,
  };
}

/**
 * photo.png + image/webp → photo_compressed.webp
 */
export function buildCompressedFilename(originalName: string, outputType: string): string {
  const base = originalName.replace(/\.[^.]+$/, "") || "image";
  return `${base}_compressed.${EXTENSIONS[outputType] ?? "jpg"}`;
}

/**
 * Bundle results into a ZIP, de-duplicating file names.
 */
export async function buildImagesZip(results: CompressResult[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Set<string>();

  for (const result of results) {
    let name = result.name;
    let n = 2;
    while (used.has(name)) {
      name = result.name.replace(/(\.[^.]+)?$/, `_${n++}$1`);
    }
    used.add(name);
    zip.file(name, result.blob);
  }

  return zip.generateAsync({ type: "blob" });
}

export function buildImagesZipFilename(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `compressed-images_${yyyy}-${mm}-${dd}.zip`;
}
