import { renderAsync } from "docx-preview";

/**
 * Convert DOCX to a self-contained HTML file.
 *
 * The output is wrapped in a complete HTML document with:
 *  - Embedded styles for clean rendering
 *  - A "Print to PDF" button (hidden when printing) that uses the browser's
 *    native print dialog — produces much higher-fidelity PDFs than our
 *    client-side DOCX→PDF can achieve
 *  - Print CSS that strips the button from the printed output
 *
 * This gives users a path to high-quality PDF output without us having to
 * solve the impossible problem of perfect client-side DOCX→PDF rendering.
 */
export async function convertDocxToHtml(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();

  const container = document.createElement("div");
  await renderAsync(buffer, container);

  const docxHtml = container.innerHTML;
  const baseName = file.name.replace(/\.docx$/i, "");

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(baseName)}</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    max-width: 900px;
    margin: 24px auto;
    padding: 20px;
    background: #f5f5f5;
  }
  .toolbar {
    position: sticky;
    top: 0;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    z-index: 10;
  }
  .toolbar .info {
    font-size: 13px;
    color: #555;
  }
  .toolbar .info strong { color: #222; }
  .print-btn {
    background: linear-gradient(90deg, #00d4ff, #7c3aed);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .print-btn:hover { transform: translateY(-1px); }
  .content {
    background: white;
    padding: 40px 50px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  /* Print styles - hide toolbar, simplify layout */
  @media print {
    body { background: white; max-width: none; margin: 0; padding: 0; }
    .toolbar { display: none !important; }
    .content { padding: 0; border: none; box-shadow: none; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <div class="info">
      <strong>${escapeHtml(baseName)}</strong> · Converted by ConvertAnyFile
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="content">
${docxHtml}
  </div>
  <script>
    // Tip: Use Ctrl+P (Cmd+P on Mac) to open print dialog and save as PDF
  </script>
</body>
</html>`;

  return new Blob([fullHtml], { type: "text/html" });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c];
  });
}
