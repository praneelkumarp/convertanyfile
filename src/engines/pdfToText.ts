// PERFORMANCE: pdfjs-dist is dynamically imported inside the function so
// the ~2 MB PDF.js library + worker do NOT load on initial page render.
// They only download when the user actually triggers a PDF conversion.

let workerConfigured = false;

async function ensurePdfjs() {
  const pdfjs = await import("pdfjs-dist");

  if (!workerConfigured) {
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    workerConfigured = true;
  }

  return pdfjs;
}

/**
 * Custom error class for PDFs that contain no extractable text.
 * Caught by the UI to show a specific, helpful message rather than
 * generic "conversion failed".
 */
export class NoTextFoundError extends Error {
  constructor() {
    super(
      "This PDF appears to be image-based (scanned or generated from images). " +
      "No text could be extracted. OCR support for scanned PDFs is planned for a future update."
    );
    this.name = "NoTextFoundError";
  }
}

export async function pdfToText(file: File): Promise<Blob> {
  const { getDocument } = await ensurePdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  let output = "";
  let totalExtractedChars = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();

    const pageText = text.items
      .map((it: any) => it.str || "")
      .join(" ")
      .trim();

    totalExtractedChars += pageText.length;
    output += `\n\n=== Page ${i} ===\n${pageText}`;
    page.cleanup();
  }

  await pdf.cleanup();
  pdf.destroy();

  // If we extracted almost no text relative to page count, this PDF
  // probably has no text layer (scanned/image-based).
  // Threshold: less than 10 characters per page on average.
  const avgCharsPerPage = totalExtractedChars / pdf.numPages;
  if (avgCharsPerPage < 10) {
    throw new NoTextFoundError();
  }

  return new Blob([output.trim()], { type: "text/plain" });
}
