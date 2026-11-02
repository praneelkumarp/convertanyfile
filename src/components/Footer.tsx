import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column with full logo */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              {/* Full transparent logo — shield + wordmark + tagline */}
              <img
                src="/logo-full-transparent.png"
                alt="ConvertAnyFile — Privacy-First File Conversion"
                width={240}
                height={72}
                className="h-auto max-w-[240px] dark:hidden"
              />
              {/* Dark variant shown on dark backgrounds */}
              <img
                src="/logo-full-dark.png"
                alt="ConvertAnyFile — Privacy-First File Conversion"
                width={240}
                height={72}
                className="h-auto max-w-[240px] hidden dark:block"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Process files entirely in your browser — no uploads, no tracking.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/convert" className="text-foreground/80 hover:text-foreground transition-colors">
                  Convert Files
                </Link>
              </li>
              <li>
                <Link to="/merge-pdf" className="text-foreground/80 hover:text-foreground transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="text-foreground/80 hover:text-foreground transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-foreground/80 hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect — disabled buttons with "Coming soon" tooltip */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Connect
            </h3>
            <div className="flex gap-3">
              <span
                aria-label="Twitter — Coming soon"
                title="Coming soon"
                className="p-2 rounded-lg bg-muted/30 text-muted-foreground/50 cursor-not-allowed relative group"
              >
                <Twitter className="h-4 w-4" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Coming soon
                </span>
              </span>
              <span
                aria-label="GitHub — Coming soon"
                title="Coming soon"
                className="p-2 rounded-lg bg-muted/30 text-muted-foreground/50 cursor-not-allowed relative group"
              >
                <Github className="h-4 w-4" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Coming soon
                </span>
              </span>
              <span
                aria-label="LinkedIn — Coming soon"
                title="Coming soon"
                className="p-2 rounded-lg bg-muted/30 text-muted-foreground/50 cursor-not-allowed relative group"
              >
                <Linkedin className="h-4 w-4" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Coming soon
                </span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Questions? <Link to="/contact" className="underline hover:text-foreground">Get in touch</Link>
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {year} ConvertAnyFile. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 inline fill-primary text-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};
