"use client";

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full mt-16 bg-[hsl(var(--bg-dark))] border-t border-[hsl(var(--border))] py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        
        {/* Left Section */}
        <p className="text-sm text-[var(--neon-aqua)]/70">
          © {new Date().getFullYear()} ConvertAnyFile — All Rights Reserved.
        </p>

        {/* Right Section */}
        <div className="flex items-center gap-6 text-sm">
          <Link 
            to="/privacy" 
            className="text-[var(--neon-purple)] hover:text-white transition"
          >
            Privacy
          </Link>

          <Link 
            to="/terms" 
            className="text-[var(--neon-aqua)] hover:text-white transition"
          >
            Terms
          </Link>

          <Link 
            to="/contact" 
            className="text-[var(--neon-purple)] hover:text-white transition"
          >
            Contact
          </Link>
        </div>

      </div>
    </footer>
  );
}
