// PERFORMANCE: pdfjs-dist is dynamically imported inside the function so
// the ~2 MB PDF.js library + worker do NOT load on initial page render.
// They only download when the user actually triggers a PDF conversion.

let workerConfigured = false;

async function ensurePdfjs() {
  const pdfjs = await import("pdfjs-dist");

  if (!workerConfigured) {
    // Set local Vite-bundled worker — never CDN
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    workerConfigured = true;
  }

  return pdfjs;
}

export async function pdfToImages(
  file: File,
  format: "png" | "jpg",
  onProgress?: (current: number, total: number) => void
) {
  const { getDocument } = await ensurePdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  const numPages = pdf.numPages;
  const resultFiles: { blob: Blob; name: string }[] = [];

  const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
  const baseName = file.name.replace(/\.pdf$/i, "");

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // pdfjs-dist v5 requires `canvas` in addition to `canvasContext`
    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any).promise;

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
        mimeType,
        0.95
      )
    );

    resultFiles.push({
      blob,
      name: `${baseName}_page_${pageNum}.${format}`,
    });

    // Free the page from memory once we're done with it
    page.cleanup();

    if (onProgress) onProgress(pageNum, numPages);
  }

  // Free the entire document
  await pdf.cleanup();
  pdf.destroy();

  return {
    success: true,
    files: resultFiles,
  };
}
