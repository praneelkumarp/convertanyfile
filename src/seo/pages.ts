/**
 * Per-page SEO: titles, descriptions and on-page guide content.
 *
 * Used in two places:
 *  - At runtime by <RouteSeo /> (head tags) and <ToolGuide /> (how-to + FAQ)
 *  - At build time by the prerender plugin in vite.config.ts, which writes a
 *    static HTML file per route so crawlers get the right tags and text
 *    without running JavaScript.
 *
 * Keep this file free of React and "@/..." imports so the build can load it.
 */

export const SITE_URL = "https://convertanyfile.online";
export const SITE_NAME = "ConvertAnyFile";

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageSeo {
  path: string;
  /** <title>, ideally under 60 characters */
  title: string;
  /** Meta description, ideally 140–160 characters */
  description: string;
  /** Plain-text H1 for the prerendered HTML */
  h1: string;
  intro: string;
  /** Present on tool pages: rendered as a how-to + FAQ section */
  guide?: {
    toolName: string;
    howToTitle: string;
    steps: string[];
    featuresTitle: string;
    features: string[];
    faqs: FaqItem[];
  };
}

const PRIVACY_FAQ: FaqItem = {
  q: "Are my files uploaded to a server?",
  a: "No. Everything runs inside your web browser using JavaScript. Your files are never uploaded, stored or seen by anyone.",
};

const FREE_FAQ: FaqItem = {
  q: "Is it free?",
  a: "Yes. The tool is completely free, with no sign-up, no watermarks and no daily limits.",
};

export const PAGES: PageSeo[] = [
  {
    path: "/",
    title: "ConvertAnyFile – Free Private File Converter, No Uploads",
    description:
      "Convert PDF, DOCX, images and more free in your browser. Merge and split PDFs, compress images — files never leave your device. No sign-up, no uploads.",
    h1: "Convert any file. Anywhere. Anytime.",
    intro:
      "Free, privacy-first file tools that run entirely in your browser: convert PDFs, Word documents, images and spreadsheets, merge and split PDFs, and compress images — without uploading anything.",
  },
  {
    path: "/convert",
    title: "Free File Converter – PDF, DOCX, JPG, PNG, WebP | No Upload",
    description:
      "Convert PDF to JPG or text, DOCX to PDF, images between JPG, PNG and WebP, Excel to CSV and more. Free, private and processed in your browser.",
    h1: "Convert Your Files",
    intro:
      "Upload your file and convert it to any supported format. All processing happens on your device — nothing is sent to a server.",
    guide: {
      toolName: "File Converter",
      howToTitle: "How to convert a file",
      steps: [
        "Drop your file into the box above, or click to choose it from your device.",
        "ConvertAnyFile detects the file type and shows the formats you can convert it to.",
        "Pick the output format. The conversion runs instantly in your browser.",
        "Your converted file downloads automatically. Multi-page results come as a ZIP.",
      ],
      featuresTitle: "Supported conversions",
      features: [
        "PDF to JPG or PNG — every page becomes an image",
        "PDF to text — extract the text from a PDF",
        "DOCX (Word) to PDF, HTML or plain text",
        "JPG, PNG and WebP — convert between image formats, or to PDF",
        "XLSX (Excel) to CSV",
        "ZIP — extract the files inside an archive",
      ],
      faqs: [
        PRIVACY_FAQ,
        {
          q: "Can I convert a scanned PDF to text?",
          a: "Not yet. Scanned PDFs contain pictures of text rather than real text, which needs OCR. The converter will tell you if a PDF looks image-based. OCR support is planned.",
        },
        {
          q: "Will my Word document look the same as a PDF?",
          a: "Text, headings, lists and tables are kept. Complex layouts with unusual fonts or floating shapes may look slightly different from Microsoft Word.",
        },
        FREE_FAQ,
      ],
    },
  },
  {
    path: "/merge-pdf",
    title: "Merge PDF Online Free – Combine PDFs Without Uploading",
    description:
      "Combine up to 5 PDF files into one, in the order you choose. Free, no sign-up, and 100% private — PDFs are merged in your browser and never uploaded.",
    h1: "Merge PDFs",
    intro:
      "Combine up to 5 PDFs into a single file — all processed locally in your browser.",
    guide: {
      toolName: "Merge PDF",
      howToTitle: "How to merge PDF files",
      steps: [
        "Drop your PDF files into the box above, or click to select them (up to 5).",
        "Use the up and down arrows to put the files in the order you want.",
        "Click “Merge PDFs & Download”.",
        "Your combined PDF downloads straight away, named with today’s date.",
      ],
      featuresTitle: "Why merge PDFs with ConvertAnyFile",
      features: [
        "Private: PDFs are combined on your device and never uploaded",
        "Lossless: pages are copied exactly, so text stays sharp and searchable",
        "Fast: no waiting for uploads or downloads from a server",
        "Free with no sign-up, watermarks or limits on how often you use it",
      ],
      faqs: [
        PRIVACY_FAQ,
        {
          q: "Will merging reduce the quality of my PDFs?",
          a: "No. Pages are copied exactly as they are, so text, images and links keep their original quality.",
        },
        {
          q: "Can I merge password-protected PDFs?",
          a: "PDFs that open without a password but have editing restrictions usually work. PDFs that need a password to open must be unlocked first.",
        },
        {
          q: "How many PDFs can I merge at once?",
          a: "Up to 5 files per merge. To combine more, merge the first batch and then merge the result with the next files.",
        },
        FREE_FAQ,
      ],
    },
  },
  {
    path: "/split-pdf",
    title: "Split PDF Online Free – Extract PDF Pages, No Upload",
    description:
      "Extract pages from a PDF or split every page into a separate file. Free, no sign-up, and private — your PDF is split in your browser, never uploaded.",
    h1: "Split PDF",
    intro:
      "Extract the pages you need or split every page into its own file — all processed locally in your browser.",
    guide: {
      toolName: "Split PDF",
      howToTitle: "How to split a PDF",
      steps: [
        "Drop your PDF into the box above, or click to choose it. You’ll see how many pages it has.",
        "Choose “Extract pages” to pick specific pages, or “Split every page” to get one PDF per page.",
        "For extracting, type the pages you want, such as 1-3, 5, 8-10.",
        "Click the button to download your new PDF, or a ZIP with every page as a separate PDF.",
      ],
      featuresTitle: "Why split PDFs with ConvertAnyFile",
      features: [
        "Private: your PDF is processed on your device and never uploaded",
        "Lossless: pages are copied exactly, with no drop in quality",
        "Flexible: pick any mix of single pages and ranges, in any order",
        "Free with no sign-up, watermarks or page limits",
      ],
      faqs: [
        PRIVACY_FAQ,
        {
          q: "How do I extract just one page from a PDF?",
          a: "Choose “Extract pages”, type the page number (for example 4), and click “Extract Pages & Download”. You’ll get a new PDF with only that page.",
        },
        {
          q: "Can I change the page order?",
          a: "Yes. Pages are saved in the order you type them, so “5, 1-3” puts page 5 first.",
        },
        {
          q: "Does splitting reduce quality?",
          a: "No. Pages are copied exactly as they are, so text stays sharp and searchable.",
        },
        FREE_FAQ,
      ],
    },
  },
  {
    path: "/compress-image",
    title: "Compress Image Online Free – Reduce JPG, PNG, WebP Size",
    description:
      "Reduce image file size, resize photos and convert to JPG or WebP. Compress up to 20 images free in your browser — private, with no uploads.",
    h1: "Compress Images",
    intro:
      "Shrink JPG, PNG and WebP images, resize them, or change their format — all processed locally in your browser.",
    guide: {
      toolName: "Compress Image",
      howToTitle: "How to compress an image",
      steps: [
        "Drop your images into the box above, or click to choose them (up to 20 JPG, PNG or WebP files).",
        "Choose the output format: keep the original, or convert to JPG or WebP for the smallest files.",
        "Set the quality — 70–80% is a good balance for photos — and optionally limit the image size.",
        "Click “Compress”, then download each image or all of them as a ZIP.",
      ],
      featuresTitle: "Why compress images with ConvertAnyFile",
      features: [
        "Private: photos are compressed on your device and never uploaded",
        "See the saving for every image before you download",
        "Resize large photos to 4K, Full HD or smaller in the same step",
        "Removes hidden photo metadata such as GPS location",
      ],
      faqs: [
        PRIVACY_FAQ,
        {
          q: "How do I reduce an image to a specific size, like 100 KB?",
          a: "Lower the quality slider and, for large photos, choose a smaller size under Resize. Each image shows its new size, so you can adjust and compress again until it’s small enough.",
        },
        {
          q: "Why didn’t my PNG get smaller?",
          a: "PNG is a lossless format, so it can’t be squeezed much further. Choose JPG or WebP as the output format for much smaller files. If an image can’t be made smaller, the original is kept.",
        },
        {
          q: "Which format gives the smallest file?",
          a: "WebP is usually smallest, followed by JPG. Both work on all modern websites and phones. Use PNG only when you need lossless quality.",
        },
        FREE_FAQ,
      ],
    },
  },
  {
    path: "/about",
    title: "About ConvertAnyFile – Privacy-First File Conversion",
    description:
      "ConvertAnyFile converts, merges, splits and compresses files directly in your browser, so your documents and photos never leave your device.",
    h1: "About ConvertAnyFile",
    intro:
      "ConvertAnyFile is a free, privacy-first file conversion platform. Every tool runs inside your browser, so your files never leave your device.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy – ConvertAnyFile",
    description:
      "How ConvertAnyFile protects your privacy: files are processed in your browser and never uploaded. Read our policy on cookies, ads and data.",
    h1: "Privacy Policy",
    intro: "Your files are processed in your browser and never uploaded to our servers.",
  },
  {
    path: "/contact",
    title: "Contact – ConvertAnyFile",
    description:
      "Get in touch with the ConvertAnyFile team with questions, feedback or feature requests.",
    h1: "Get in Touch",
    intro: "Questions, feedback or feature requests? We’d love to hear from you.",
  },
  {
    path: "/terms",
    title: "Terms of Service – ConvertAnyFile",
    description: "The terms that apply when you use ConvertAnyFile’s free in-browser file tools.",
    h1: "Terms of Service",
    intro: "The terms that apply when you use ConvertAnyFile.",
  },
];

export function getPageSeo(path: string): PageSeo | undefined {
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return PAGES.find((page) => page.path === normalized);
}

export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/**
 * JSON-LD structured data for a page.
 */
export function buildJsonLd(page: PageSeo): object[] {
  const url = canonicalUrl(page.path);

  if (page.path === "/") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url,
        description: page.description,
      },
    ];
  }

  if (!page.guide) return [];

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${page.guide.toolName} – ${SITE_NAME}`,
      url,
      description: page.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (runs in a web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];
}
