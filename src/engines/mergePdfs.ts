/**
 * Merge multiple PDF files into a single PDF.
 *
 * PERFORMANCE: pdf-lib is dynamically imported so it only loads when a user
 * actually merges PDFs — not on the initial page load.
 *
 * PRIVACY: All processing happens in the browser. Files never leave the device.
 */

export interface MergeProgress {
  current: number;
  total: number;
  currentFileName: string;
}

export async function mergePdfs(
  files: File[],
  onProgress?: (p: MergeProgress) => void
): Promise<Blob> {
  if (files.length < 2) {
    throw new Error("Please select at least 2 PDF files to merge.");
  }

  // Lazy-load pdf-lib
  const { PDFDocument } = await import("pdf-lib");

  // Create the output document
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    onProgress?.({
      current: i + 1,
      total: files.length,
      currentFileName: file.name,
    });

    let sourcePdf;
    try {
      const buffer = await file.arrayBuffer();
      // ignoreEncryption: true allows merging password-protected PDFs IF
      // they can be read without the password (i.e., owner-locked, not user-locked).
      // If a PDF requires a password to even open, this still throws.
      sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    } catch (err: any) {
      throw new Error(
        `Could not read "${file.name}". The file may be corrupted, password-protected, or not a valid PDF.`
      );
    }

    const copiedPages = await mergedPdf.copyPages(
      sourcePdf,
      sourcePdf.getPageIndices()
    );

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Save and return as Blob
  const mergedBytes = await mergedPdf.save();
  // Wrap in Uint8Array first so the Blob constructor gets a clean BufferSource
  return new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
}

/**
 * Build a date-stamped filename: merged_YYYY-MM-DD.pdf
 */
export function buildMergedFilename(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `merged_${yyyy}-${mm}-${dd}.pdf`;
}
