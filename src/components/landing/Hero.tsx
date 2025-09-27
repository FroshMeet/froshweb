'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SmartSchoolSearch } from '@/components/SmartSchoolSearch';
import { School } from '@/data/schools';
import { getCorrectSchoolSlug } from '@/utils/schoolNavigation';
export default function Hero() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    
    const correctSlug = getCorrectSchoolSlug(school);
    navigate(`/${correctSlug}`);
  };
  return <section className="relative overflow-hidden">
      {/* subtle blue glow */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="w-[900px] h-[900px] rounded-full blur-3xl" style={{
        background: 'radial-gradient(40% 40% at 50% 20%, rgba(6,97,216,.35), transparent 70%)'
      }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28 grid md:grid-cols-2 gap-10 items-center">
        {/* Copy block */}
        <div>
          {/* Headline split to give "Class of 2030" its own row */}
          <h1 className="font-extrabold leading-[1.05] animate-fade-in">
            <span className="block text-5xl md:text-7xl">Meet</span>
            <span className="text-[#0661d8] text-5xl md:text-7xl">Class of 2030</span>
            <span className="block text-5xl md:text-7xl">before Day One</span>
          </h1>

          <p className="text-zinc-300 mt-4 max-w-xl text-lg md:text-xl animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            Find roommates, group chats, and new friends at your school — before the year even starts.
          </p>

          <p className="mt-3 font-semibold text-[#0661d8] text-base md:text-lg animate-fade-in" style={{
          animationDelay: '0.18s'
        }}>
            🎓 Launching for Class of 2030 at 100+ colleges.
          </p>

          {/* Smart School Search */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 animate-fade-in" style={{
            animationDelay: '0.26s'
          }}>
            <div className="flex-1">
              <SmartSchoolSearch
                onSelect={handleSchoolSelect}
                placeholder="Search for your school…"
                selectedSchool={selectedSchool}
                className="w-full"
              />
            </div>

            <Button onClick={() => navigate('/community')} className="w-full sm:w-auto px-6 py-4 text-base rounded-2xl font-semibold bg-primary hover:bg-primary/90">
              Explore School
            </Button>
          </div>

          <div className="mt-5 text-xs text-zinc-400">⚠️ FroshMeet is a student-run platform and is not officially affiliated with or endorsed by any college or university.</div>
        </div>

        {/* Phone/UI preview (built in code; crisp without external asset) */}
        <div className="flex justify-center animate-scale-in" style={{
        animationDelay: '0.05s'
      }}>
          <div className="relative w-[340px] lg:w-[380px] h-[660px] lg:h-[740px] rounded-[2rem] bg-[#0f1410] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,.6)] overflow-hidden">
            <div className="absolute left-1/2 -translate-x-1/2 top-3 w-28 h-6 rounded-full bg-black/60" />
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">Meet</div>
                <div className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-zinc-300">Discover</div>
                <div className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-zinc-300">Chat</div>
              </div>
              <div className="bg-[#121811] border border-white/10 rounded-xl p-3 shadow-[0_8px_40px_rgba(0,0,0,.35)]">
                <div className="h-64 lg:h-72 rounded-xl bg-[url('https://images.unsplash.com/photo-1541233349642-6e425fe6190e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
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
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121811] border border-white/10 rounded-xl p-3">
                  <div className="h-20 lg:h-24 rounded-lg bg-[url('https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                  <div className="mt-2 text-xs text-zinc-300">Find Roommates</div>
                </div>
                <div className="bg-[#121811] border border-white/10 rounded-xl p-3">
                  <div className="h-20 lg:h-24 rounded-lg bg-[url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                  <div className="mt-2 text-xs text-zinc-300">Join Group Chats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}