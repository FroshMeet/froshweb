import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

// Import logos (same as Community.tsx)
import harvardLogo from "@/assets/logos/harvard.png";
import stanfordLogo from "@/assets/logos/stanford.png";
import mitLogo from "@/assets/logos/mit.png";
import uclaLogo from "@/assets/logos/ucla.png";
import yaleLogo from "@/assets/logos/yale.png";
import uscLogo from "@/assets/logos/usc.png";
import ucBerkeleyLogo from "@/assets/logos/uc-berkeley.png";
import nyuLogo from "@/assets/logos/nyu.png";
import umichLogo from "@/assets/logos/umich.png";
import dukeLogo from "@/assets/logos/duke.png";
import princetonLogo from "@/assets/logos/princeton.png";
import northwesternLogo from "@/assets/logos/northwestern.png";
import upennLogo from "@/assets/logos/upenn.png";
import columbiaLogo from "@/assets/logos/columbia.png";

interface SchoolCarouselProps {
  schools: Array<{ name: string; slug: string; acronym: string; }>;
  onSchoolSelect: (name: string, slug: string) => void;
}

export const SwipeableSchoolCarousel: React.FC<SchoolCarouselProps> = ({
  schools,
  onSchoolSelect,
}) => {
  const isMobile = useIsMobile();
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map school slug to school ID for logo lookup (same as Community.tsx)
  const getSchoolId = (slug: string): string => {
    const slugToIdMap: Record<string, string> = {
      'harvard': 'harvard',
      'stanford': 'stanford',
      'mit': 'mit',
      'ucla': 'ucla',
      'yale': 'yale',
      'usc': 'usc',
      'uc-berkeley': 'uc-berkeley',
      'nyu': 'nyu',
      'umich': 'umich',
      'duke': 'duke',
      'princeton': 'princeton',
      'northwestern': 'northwestern',
      'upenn': 'upenn',
      'columbia': 'columbia',
    };
    return slugToIdMap[slug] || slug;
  };

  // Get school logo (same logic as Community.tsx)
  const getSchoolLogo = (slug: string) => {
    const schoolId = getSchoolId(slug);
    const logoMap: Record<string, string> = {
      'harvard': harvardLogo,
      'stanford': '/lovable-uploads/Stanford_Logo.png',
      'mit': mitLogo,
      'ucla': '/lovable-uploads/UCLA_Logo.png',
      'yale': yaleLogo,
      'usc': '/lovable-uploads/USC_Logo.png',
      'uc-berkeley': ucBerkeleyLogo,
      'nyu': nyuLogo,
      'umich': umichLogo,
      'duke': dukeLogo,
      'princeton': '/lovable-uploads/Princeton_Logo.png',
      'northwestern': northwesternLogo,
      'upenn': '/lovable-uploads/UPenn_Logo.png',
      'columbia': columbiaLogo,
    };
    return logoMap[schoolId];
  };

  // Get school initials fallback
  const getSchoolInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  // Resume animation after 1.5 seconds of no interaction
  const scheduleResume = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const scrollAmount = 300;
      if (isLeftSwipe) {
        setScrollPosition(prev => prev + scrollAmount);
      } else {
        setScrollPosition(prev => Math.max(0, prev - scrollAmount));
      }
    }
    
    scheduleResume();
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Apply manual scroll position when user swipes on mobile
  useEffect(() => {
    if (isMobile && containerRef.current) {
      containerRef.current.style.transform = `translateX(-${scrollPosition}px)`;
    }
  }, [scrollPosition, isMobile]);

  // Double schools for seamless loop
  const topRowSchools = [...schools, ...schools];
  const bottomRowSchools = [...schools.slice(10), ...schools, ...schools.slice(0, 10)];

  const carouselClasses = `${
    isMobile 
      ? (isPaused ? '' : 'animate-scroll-carousel-fast')
      : 'animate-scroll-carousel-fast'
  }`;

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div
        ref={containerRef}
        className={carouselClasses}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Row */}
        <div className="flex space-x-6 mb-6">
          {topRowSchools.map((school, index) => (
            <Button
              key={`top-${school.name}-${index}`}
              variant="outline"
              onClick={() => onSchoolSelect(school.name, school.slug)}
              className={`flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden ${
                isMobile 
                  ? 'hover:scale-105' 
                  : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 hover:scale-105'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 ${!isMobile ? 'group-hover:opacity-100' : ''}`}></div>
              <div className={`relative z-10 w-10 md:w-12 h-10 md:h-12 rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/30 ${!isMobile ? 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-primary/60' : ''}`}>
                {getSchoolLogo(school.slug) ? (
                  <img 
                    src={getSchoolLogo(school.slug)} 
                    alt={`${school.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary/70 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-base md:text-lg">
                      {getSchoolInitials(school.name)}
                    </span>
                  </div>
                )}
              </div>
              <span className="relative z-10 text-center leading-tight font-semibold px-2">
                {school.acronym}
              </span>
            </Button>
          ))}
        </div>
        
        {/* Bottom Row - Offset */}
        <div className="flex space-x-6" style={{ marginLeft: '5rem' }}>
          {bottomRowSchools.map((school, index) => (
            <Button
              key={`bottom-${school.name}-${index}`}
              variant="outline"
              onClick={() => onSchoolSelect(school.name, school.slug)}
              className={`flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden ${
                isMobile 
                  ? 'hover:scale-105' 
                  : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 hover:scale-105'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 ${!isMobile ? 'group-hover:opacity-100' : ''}`}></div>
              <div className={`relative z-10 w-10 md:w-12 h-10 md:h-12 rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/30 ${!isMobile ? 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-primary/60' : ''}`}>
                {getSchoolLogo(school.slug) ? (
                  <img 
                    src={getSchoolLogo(school.slug)} 
                    alt={`${school.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary/70 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-base md:text-lg">
                      {getSchoolInitials(school.name)}
                    </span>
                  </div>
                )}
              </div>
              <span className="relative z-10 text-center leading-tight font-semibold px-2">
                {school.acronym}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeableSchoolCarousel;