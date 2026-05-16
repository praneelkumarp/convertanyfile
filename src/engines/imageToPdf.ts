import { PDFDocument } from "pdf-lib";

/**
 * Image → PDF
 *
 * Robust against:
 *  - Missing/wrong file.type
 *  - WEBP input (pdf-lib only supports PNG/JPEG natively, so we transcode WEBP -> PNG via canvas)
 *  - Files where extension says one thing but bytes say another
 */
export async function imageToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Magic-byte detection (don't trust file.type)
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  // WEBP: starts with "RIFF"...."WEBP"
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  const pdfDoc = await PDFDocument.create();

  let image;
  let width: number;
  let height: number;

  if (isPng) {
    image = await pdfDoc.embedPng(arrayBuffer);
    width = image.width;
    height = image.height;
  } else if (isJpg) {
    image = await pdfDoc.embedJpg(arrayBuffer);
    width = image.width;
    height = image.height;
  } else if (isWebp) {
    // Transcode WEBP -> PNG via canvas, then embed
    const blob = new Blob([arrayBuffer], { type: "image/webp" });
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable for WEBP transcode");
    ctx.drawImage(bitmap, 0, 0);

    const pngBlob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("WEBP transcode failed"))),
        "image/png"
      )
    );
    const pngBuffer = await pngBlob.arrayBuffer();
    image = await pdfDoc.embedPng(pngBuffer);
    width = image.width;
    height = image.height;
  } else {
    throw new Error(
      "Unsupported image format. Supported: PNG, JPEG, WEBP."
    );
  }

  const page = pdfDoc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
