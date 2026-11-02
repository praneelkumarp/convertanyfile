/**
 * Split a PDF: extract selected pages into a new PDF, or split every page
 * into its own PDF (bundled as a ZIP).
 *
 * PERFORMANCE: pdf-lib and JSZip are dynamically imported so they only load
 * when a user actually splits a PDF — not on the initial page load.
 *
 * PRIVACY: All processing happens in the browser. Files never leave the device.
 */

export interface SplitProgress {
  current: number;
  total: number;
}

async function loadPdf(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  try {
    const buffer = await file.arrayBuffer();
    // ignoreEncryption: true allows owner-locked PDFs that open without a password.
    return await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(
      `Could not read "${file.name}". The file may be corrupted, password-protected, or not a valid PDF.`
    );
  }
}

/**
 * Return the number of pages in a PDF.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const pdf = await loadPdf(file);
  return pdf.getPageCount();
}

/**
 * Parse a page selection like "1-3, 5, 8-10" into zero-based page indices,
 * in the order given. Throws a user-facing error for invalid input.
 */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Please enter the pages to extract, e.g. 1-3, 5.");
  }

  const indices: number[] = [];
  const seen = new Set<number>();

  for (const part of parts) {
    const match = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!match) {
      throw new Error(`"${part}" is not a valid page or range. Use numbers like 2 or 4-7.`);
    }

    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : start;

    if (start < 1 || end < 1) {
      throw new Error(`"${part}" is not valid. Page numbers start at 1.`);
    }
    if (start > pageCount || end > pageCount) {
      throw new Error(`"${part}" is outside this PDF, which has ${pageCount} page${pageCount === 1 ? "" : "s"}.`);
    }
    if (start > end) {
      throw new Error(`"${part}" is backwards. Write ranges low to high, e.g. ${end}-${start}.`);
    }

    for (let page = start; page <= end; page++) {
      if (!seen.has(page)) {
        seen.add(page);
        indices.push(page - 1);
      }
    }
  }

  return indices;
}

/**
 * Copy the given zero-based pages into a new PDF.
 */
export async function extractPages(file: File, pageIndices: number[]): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const sourcePdf = await loadPdf(file);

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const bytes = await newPdf.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

/**
 * Split every page into its own PDF and bundle them in a ZIP.
 */
export async function splitEveryPage(
  file: File,
  onProgress?: (p: SplitProgress) => void
): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const { default: JSZip } = await import("jszip");
  const sourcePdf = await loadPdf(file);

  const total = sourcePdf.getPageCount();
  const baseName = getBaseName(file.name);
  const digits = String(total).length;
  const zip = new JSZip();

  for (let i = 0; i < total; i++) {
    onProgress?.({ current: i + 1, total });

    const pagePdf = await PDFDocument.create();
    const [page] = await pagePdf.copyPages(sourcePdf, [i]);
    pagePdf.addPage(page);

    const bytes = await pagePdf.save();
    const pageNumber = String(i + 1).padStart(digits, "0");
    zip.file(`${baseName}_page-${pageNumber}.pdf`, bytes);
  }

  return zip.generateAsync({ type: "blob" });
}

function getBaseName(filename: string): string {
  return filename.replace(/\.pdf$/i, "") || "document";
}

/**
 * Filename for extracted pages: report_pages.pdf
 */
export function buildExtractedFilename(originalName: string): string {
  return `${getBaseName(originalName)}_pages.pdf`;
}

/**
 * Filename for the split-all ZIP: report_split.zip
 */
export function buildSplitZipFilename(originalName: string): string {
  return `${getBaseName(originalName)}_split.zip`;
}
