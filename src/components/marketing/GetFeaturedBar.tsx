'use client';
import React from 'react';

type Props = {
  onOpen?: () => void; // fallback if we need to pass a handler down
};

export default function GetFeaturedBar({ onOpen }: Props) {
  // Use the handler passed down as prop
  const handleOpen = onOpen ?? (() => {});

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[40] px-3 sm:px-4">
      <div className="pointer-events-auto mx-auto max-w-7xl">
        <div className="rounded-2xl shadow-2xl border border-white/10 
                        bg-[radial-gradient(120%_120%_at_0%_0%,rgba(236,72,153,.25),transparent_45%),radial-gradient(120%_120%_at_100%_0%,rgba(245,158,11,.25),transparent_45%)] 
                        backdrop-blur-md px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">✨</span>
            <div>
              <div className="font-semibold">Get Featured on Instagram</div>
              <div className="text-sm text-zinc-300">Be one of the first Class of 2030 students featured across 100+ campuses.</div>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="whitespace-nowrap rounded-2xl bg-white text-black font-semibold px-4 sm:px-5 py-2.5 hover:brightness-95 transition"
          >
            Start Your Feature Application
          </button>
        </div>
      </div>
    </div>
  );
}