import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeableSchoolCarouselProps {
  schools: Array<{ name: string; slug: string; acronym: string; }>;
  onSchoolSelect: (name: string, slug: string) => void;
  isTopRow?: boolean;
}

export const SwipeableSchoolCarousel: React.FC<SwipeableSchoolCarouselProps> = ({
  schools,
  onSchoolSelect,
  isTopRow = true
}) => {
  const isMobile = useIsMobile();
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Handle swipe - adjust scroll position
      const container = containerRef.current;
      if (container) {
        const scrollAmount = 200; // Adjust as needed
        if (isLeftSwipe) {
          setScrollPosition(prev => prev + scrollAmount);
        } else {
          setScrollPosition(prev => Math.max(0, prev - scrollAmount));
        }
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

  const carouselClasses = `flex space-x-6 ${
    isMobile 
      ? (isPaused ? '' : 'animate-scroll-carousel-fast')
      : 'animate-scroll-carousel-fast'
  }`;

  const containerStyle = isTopRow ? {} : { marginLeft: '5rem' };

  // Double the schools array for seamless loop
  const displaySchools = isTopRow 
    ? [...schools, ...schools]
    : [...schools.slice(10), ...schools, ...schools.slice(0, 10)];

  return (
    <div className="overflow-hidden">
      <div
        ref={containerRef}
        className={carouselClasses}
        style={containerStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displaySchools.map((school, index) => (
          <Button
            key={`${isTopRow ? 'top' : 'bottom'}-${school.name}-${index}`}
            variant="outline"
            onClick={() => onSchoolSelect(school.name, school.slug)}
            className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 transition-all duration-500 hover:scale-105 bg-card/40 border-border/40 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary/40 to-primary/70 rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
              <span className="text-primary-foreground font-bold text-base md:text-lg">
                {school.name.charAt(0)}
              </span>
            </div>
            <span className="relative z-10 text-center leading-tight font-semibold px-2">
              {school.acronym}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};