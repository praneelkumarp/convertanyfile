import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export async function pdfToText(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  let output = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();

    const pageText = text.items
      .map((it: any) => it.str || "")
      .join(" ");

    output += `\n\n=== Page ${i} ===\n${pageText}`;
    page.cleanup();
  }

  await pdf.cleanup();
  pdf.destroy();

  return new Blob([output.trim()], { type: "text/plain" });
}
