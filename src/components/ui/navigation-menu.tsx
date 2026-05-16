"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function NavigationMenu() {
  return (
    <nav className="
      w-full 
      bg-[hsl(var(--bg-dark))] 
      border-b 
      border-[hsl(var(--border))] 
      px-6 py-4 
      flex items-center justify-between 
      shadow-[0_0_20px_rgba(0,0,0,0.3)]
      z-50
    ">
      {/* ---------------------- LOGO ---------------------- */}
      <div className="flex items-center gap-3">
        <div className="
          w-10 h-10 
          rounded-xl 
          bg-gradient-to-br 
          from-[var(--neon-purple)] 
          to-[var(--neon-aqua)] 
          shadow-[0_0_15px_rgba(0,212,255,0.5)]
          flex items-center justify-center 
          font-extrabold 
          text-black text-xl
        ">
          C
        </div>

        <div>
          <h1 className="font-bold text-white text-lg">ConvertAnyFile</h1>
          <p className="text-xs text-[var(--neon-aqua)]/80">
            Privacy-first file converter
          </p>
        </div>
      </div>

      {/* ---------------------- MENU LINKS ---------------------- */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/convert"
          className="
            text-[var(--neon-aqua)] 
            hover:text-white 
            transition
          "
        >
          Convert
        </Link>

        <Link
          to="/tools"
          className="
            text-[var(--neon-purple)] 
            hover:text-white 
            transition
          "
        >
          Tools
        </Link>

        <Link
          to="/about"
          className="
            text-[var(--neon-aqua)] 
            hover:text-white 
            transition
          "
        >
          About
        </Link>

        {/* TRY NOW Button */}
        <Link
          to="/convert"
          className="
            px-4 py-2 
            rounded-lg 
            bg-gradient-to-r 
            from-[var(--neon-purple)] 
            to-[var(--neon-aqua)] 
            text-black 
            font-semibold 
            shadow-[0_0_20px_rgba(124,58,237,0.6)]
            hover:scale-105 
            transition-transform
          "
        >
          Try Now
        </Link>
      </div>
    </nav>
  );
}
