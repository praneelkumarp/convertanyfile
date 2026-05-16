"use client";

export function NeonLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      {/* Neon Pulse Circle */}
      <div
        className="
          w-10 h-10 
          rounded-full 
          bg-[var(--neon-aqua)] 
          animate-ping
          shadow-[0_0_25px_rgba(0,212,255,0.7)]
        "
      ></div>

      {/* Loading Text */}
      <p className="text-[var(--neon-aqua)] text-sm tracking-wide">
        Processing…
      </p>
    </div>
  );
}
