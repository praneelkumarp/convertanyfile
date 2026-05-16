import * as mammoth from "mammoth";

export async function convertDocxToText(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({ arrayBuffer });
  return new Blob([result.value], { type: "text/plain" });
}
