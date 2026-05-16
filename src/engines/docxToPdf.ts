import { PDFDocument } from "pdf-lib";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";

/**
 * DOCX → PDF (client-side, v4)
 *
 * ROOT CAUSE OF v3's STRIKETHROUGH ARTIFACT:
 *
 * docx-preview renders Word's `<w:vAlign w:val="bottom"/>` table cells by
 * setting `vertical-align: bottom` on the <td>. This pushes the text to
 * the bottom edge of the cell. The next row's TOP border is then drawn
 * immediately below — but due to CSS box-model rounding, those two pixel
 * rows overlap, and the border ends up drawn THROUGH the bottom of the
 * text in the cell above. This looks like strikethrough across the table.
 *
 * Word doesn't have this bug because it has true layout engine with
 * proper line metrics. docx-preview's HTML approximation does.
 *
 * FIX:
 *  - Force `vertical-align: top` on all table cells, then add bottom padding
 *    to compensate. This pushes text away from the bottom border.
 *  - Add `border-spacing: 0` and `border-collapse: collapse` for clean borders.
 *  - Ensure cells have explicit padding so text never touches borders.
 *
 * Also keeps the previous v3 fixes:
 *  - Per-page section capture (no whole-document slicing)
 *  - `ignoreLastRenderedPageBreak: false` for proper page detection
 *  - Per-page PDF sizing (no awkward empty space)
 */
export async function convertDocxToPdf(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.background = "white";
  document.body.appendChild(container);

  // Inject CSS that fixes the vAlign="bottom" rendering artifact
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-cvf", "docx-fix-v4");
  styleEl.textContent = `
    /* Force clean border rendering on all docx tables */
    section.docx table,
    section.docx tbody {
      border-collapse: collapse !important;
      border-spacing: 0 !important;
    }

    /* THE KEY FIX: override vertical-align: bottom on cells.
       docx-preview's bottom-aligned cells cause the next row's top border
       to overlap with the bottom of this cell's text, creating fake
       strikethrough lines. Force everything to vertical-align: top and
       use padding to push text inward, away from borders. */
    section.docx td,
    section.docx th {
      vertical-align: top !important;
      padding: 4px 6px !important;
      box-sizing: border-box;
      /* Eliminate any text-decoration that could appear as strikethrough */
      text-decoration: none !important;
    }

    /* Make sure paragraphs inside cells don't have margins that affect layout */
    section.docx td p,
    section.docx th p {
      margin: 0 !important;
      padding: 0 !important;
      text-decoration: none !important;
    }

    /* Ensure sections are fully visible */
    section.docx {
      overflow: visible !important;
      page-break-after: always;
      background: #ffffff;
    }
  `;
  document.head.appendChild(styleEl);

  try {
    await renderAsync(buffer, container, undefined, {
      inWrapper: true,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      trimXmlDeclaration: true,
      experimental: false,
      useBase64URL: false,
    });

    // Let layout settle
    await new Promise((r) => setTimeout(r, 250));

    let pageElements: HTMLElement[] = Array.from(
      container.querySelectorAll<HTMLElement>("section.docx")
    );

    if (pageElements.length === 0) {
      pageElements = [container];
    }

    const pdfDoc = await PDFDocument.create();
    const scale = 2;

    for (const pageEl of pageElements) {
      const canvas = await html2canvas(pageEl, {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: pageEl.offsetWidth || undefined,
        windowHeight: pageEl.offsetHeight || undefined,
      });

      const pngDataUrl = canvas.toDataURL("image/png");
      const img = await pdfDoc.embedPng(pngDataUrl);

      // Convert from CSS pixels (96dpi) to PDF points (72dpi)
      const elementPxWidth = canvas.width / scale;
      const elementPxHeight = canvas.height / scale;
      const pdfPtWidth = (elementPxWidth * 72) / 96;
      const pdfPtHeight = (elementPxHeight * 72) / 96;

      const page = pdfDoc.addPage([pdfPtWidth, pdfPtHeight]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: pdfPtWidth,
        height: pdfPtHeight,
      });
    }

    const bytes = await pdfDoc.save();
    return new Blob([bytes], { type: "application/pdf" });
  } finally {
    if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    if (container.parentNode) container.parentNode.removeChild(container);
  }
}
