'use client';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle blue glow */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div
          className="w-[900px] h-[900px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(40% 40% at 50% 20%, rgba(6,97,216,.35), transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Copy block */}
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Meet your <span className="text-[#0661d8]">Class of 2030</span><br /> before Day One.
          </h1>
          <p className="text-zinc-300 mt-4 max-w-xl">
            Find roommates, group chats, and new friends at your school — before the year even starts.
          </p>
          <p className="mt-3 font-semibold text-[#0661d8]">
            🎓 Launching for Class of 2030 at 100+ colleges.
          </p>

          {/* search + CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Search for your school…"
              className="rounded-2xl px-4 py-3 w-full bg-[#1a1f15] text-white placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-700/40"
            />
            <button className="bg-[#0661d8] hover:brightness-110 px-5 py-3 rounded-2xl font-semibold">
              Explore School
            </button>
          </div>

          <div className="mt-5 text-xs text-zinc-400">Freshmen-only • Safe • Free</div>
        </div>

        {/* Built-in phone mockup (no image asset required) */}
        <div className="flex justify-center">
          <div className="relative w-[320px] h-[640px] rounded-[2rem] bg-[#0f1410] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,.6)] overflow-hidden">
            {/* glow */}
            <div className="absolute -inset-x-1/2 -top-1/3 h-1/2 rounded-full blur-2xl"
                 style={{ background: 'radial-gradient(50% 50% at 30% 30%, rgba(6,97,216,.35), transparent 60%)' }} />
            {/* notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-3 w-28 h-6 rounded-full bg-black/60" />

            <div className="p-4 flex flex-col gap-4">
              {/* tabs */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">Meet</div>
                <div className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-zinc-300">Discover</div>
                <div className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-zinc-300">Chat</div>
              </div>

              {/* swipe card */}
              <div className="bg-[#121811] border border-white/10 rounded-xl p-3 shadow-[0_8px_40px_rgba(0,0,0,.35)]">
                <div className="h-64 rounded-xl bg-[url('https://images.unsplash.com/photo-1541233349642-6e425fe6190e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold">Alex • Class of 2030</div>
                    <div className="text-xs text-zinc-400">Computer Science @ State U</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-12 h-12 rounded-full bg-white/10 grid place-items-center border border-white/10">✖</button>
                    <button className="w-12 h-12 rounded-full bg-[#0661d8]">❤</button>
                  </div>
                </div>
              </div>

              {/* mini tiles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121811] border border-white/10 rounded-xl p-3">
                  <div className="h-20 rounded-lg bg-[url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                  <div className="mt-2 text-xs text-zinc-300">Find Roommates</div>
                </div>
                <div className="bg-[#121811] border border-white/10 rounded-xl p-3">
                  <div className="h-20 rounded-lg bg-[url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                  <div className="mt-2 text-xs text-zinc-300">Join Group Chats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}