'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SmartSchoolSearch } from '@/components/SmartSchoolSearch';
import { School } from '@/data/schools';
import { getCorrectSchoolSlug } from '@/utils/schoolNavigation';
import phoneMockup from '@/assets/phone-mockup.png';
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

        {/* Phone mockup image */}
        <div className="flex justify-center animate-scale-in" style={{
        animationDelay: '0.05s'
      }}>
          <img 
            src={phoneMockup} 
            alt="FroshMeet App Mockup" 
            className="w-[408px] lg:w-[456px] h-[792px] lg:h-[888px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>;
}