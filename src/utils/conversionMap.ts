// Conversion mapping: source extension -> possible target formats
// Per spec: client-side only. Server-requiring entries removed.
export interface ConversionOption {
  target: string;
  label: string;
  clientCapable: boolean;
  engineHint: string;
  description?: string;
  /** If set, displays a warning UI explaining a fidelity limitation */
  fidelityWarning?: {
    severity: "info" | "warning";
    title: string;
    message: string;
    recommendation?: string;
  };
}

export const CONVERSION_MAP: Record<string, ConversionOption[]> = {
  // ------------------------------
  // PDF
  // ------------------------------
  pdf: [
    {
      target: "png",
      label: "PNG Images (per page)",
      clientCapable: true,
      engineHint: "pdf.js + Canvas",
      description: "Convert each PDF page to a PNG image",
    },
    {
      target: "jpg",
      label: "JPEG Images (per page)",
      clientCapable: true,
      engineHint: "pdf.js + Canvas",
      description: "Convert each PDF page to a JPEG image",
    },
    {
      target: "txt",
      label: "Text Extraction",
      clientCapable: true,
      engineHint: "pdf.js",
      description: "Extract readable text from PDF document",
    },
  ],

  // ------------------------------
  // Images
  // ------------------------------
  png: [
    {
      target: "jpg",
      label: "JPEG",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert PNG to JPEG format",
    },
    {
      target: "webp",
      label: "WebP",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert PNG to WebP format",
    },
    {
      target: "pdf",
      label: "PDF Document",
      clientCapable: true,
      engineHint: "pdf-lib",
      description: "Embed image into a PDF document",
    },
  ],
  jpg: [
    {
      target: "png",
      label: "PNG",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert JPEG to PNG format",
    },
    {
      target: "webp",
      label: "WebP",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert JPEG to WebP format",
    },
    {
      target: "pdf",
      label: "PDF Document",
      clientCapable: true,
      engineHint: "pdf-lib",
      description: "Embed image into a PDF document",
    },
  ],
  jpeg: [
    {
      target: "png",
      label: "PNG",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert JPEG to PNG format",
    },
    {
      target: "webp",
      label: "WebP",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert JPEG to WebP format",
    },
    {
      target: "pdf",
      label: "PDF Document",
      clientCapable: true,
      engineHint: "pdf-lib",
      description: "Embed image into a PDF document",
    },
  ],
  webp: [
    {
      target: "png",
      label: "PNG",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert WebP to PNG format",
    },
    {
      target: "jpg",
      label: "JPEG",
      clientCapable: true,
      engineHint: "Canvas API",
      description: "Convert WebP to JPEG format",
    },
    {
      target: "pdf",
      label: "PDF Document",
      clientCapable: true,
      engineHint: "pdf-lib",
      description: "Embed image into a PDF document",
    },
  ],

  // ------------------------------
  // DOCX
  // ------------------------------
  docx: [
    {
      target: "html",
      label: "HTML",
      clientCapable: true,
      engineHint: "docx-preview",
      description: "Convert to HTML with built-in 'Print to PDF' button — best fidelity for PDF output",
    },
    {
      target: "txt",
      label: "Plain Text",
      clientCapable: true,
      engineHint: "mammoth.js",
      description: "Extract readable text from DOCX",
    },
    {
      target: "pdf",
      label: "PDF",
      clientCapable: true,
      engineHint: "docx-preview + html2canvas + pdf-lib",
      description: "Convert DOCX to PDF (image-based, best for simple documents)",
      fidelityWarning: {
        severity: "warning",
        title: "Fidelity limitations apply",
        message:
          "Client-side DOCX → PDF works best for simple documents. Complex tables, headers/footers, footnotes, or documents with mixed vertical-alignment cells may render imperfectly. The output is image-based, so text is not selectable in the PDF.",
        recommendation:
          "For best results with complex documents, convert to HTML instead and use your browser's Print → Save as PDF feature.",
      },
    },
  ],

  // ------------------------------
  // XLSX
  // ------------------------------
  xlsx: [
    {
      target: "csv",
      label: "CSV",
      clientCapable: true,
      engineHint: "SheetJS",
      description: "Extract data to CSV format",
    },
  ],

  // ------------------------------
  // ZIP
  // ------------------------------
  zip: [
    {
      target: "extract",
      label: "Extract ZIP",
      clientCapable: true,
      engineHint: "JSZip",
      description: "Unpack ZIP files client-side",
    },
  ],
};

export function getConversionOptions(extension: string): ConversionOption[] {
  return CONVERSION_MAP[extension.toLowerCase()] || [];
}
