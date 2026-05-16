"use client";

import React from "react";

interface NeonModalProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function NeonModal({ open, onClose, children }: NeonModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 
        bg-black/75 
        backdrop-blur-sm 
        flex items-center justify-center 
        z-50 
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          bg-[hsl(var(--bg-panel))] 
          border border-[var(--neon-purple)] 
          rounded-xl 
          p-6 
          max-w-lg 
          w-[90%]
          shadow-[0_0_40px_rgba(124,58,237,0.5)]
          relative
          animate-scaleIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="
              absolute top-3 right-3 
              text-[var(--neon-aqua)] 
              hover:text-white 
              text-lg 
              font-bold 
              transition
            "
          >
            ✕
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
