'use client';
import React from 'react';

// REUSE: import the real open handler if available
// Example (adjust path/name based on repo):
// import { openGetFeatured } from '@/lib/modals/getFeatured';

type Props = { onOpen?: () => void };

export default function GetFeaturedPromo({ onOpen }: Props) {
  const handleOpen =
    // prefer real imported function if it exists
    (typeof (globalThis as any).openGetFeatured === 'function'
      ? (globalThis as any).openGetFeatured
      : undefined) ||
    // else use prop
    onOpen ||
    // final fallback: click any existing trigger
    (() => {
      const el = document.querySelector('[data-feature-popup-trigger]') as HTMLElement | null;
      el?.click();
    });

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-14">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-2xl border border-white/10 shadow-2xl
                     px-5 sm:px-7 lg:px-8 py-6 sm:py-7 lg:py-8
                     flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6"
          style={{
            // soft gradient like your original big bar
            background:
              'radial-gradient(120% 120% at 0% 0%, rgba(236,72,153,.22), transparent 48%), ' +
              'radial-gradient(120% 120% at 100% 0%, rgba(245,158,11,.22), transparent 48%), ' +
              '#0f1410',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-start md:items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <div className="text-base sm:text-lg font-semibold">Get Featured on Instagram</div>
              <div className="text-sm text-zinc-300">
                Be one of the first Class of 2030 students featured across 100+ campuses.
              </div>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="whitespace-nowrap rounded-2xl bg-white text-black font-semibold
                       px-4 sm:px-5 py-2.5 hover:brightness-95 transition"
          >
            Start Your Feature Application
          </button>
        </div>
      </div>
    </section>
  );
}