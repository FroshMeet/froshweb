import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SchoolCarouselProps {
  schools: Array<{ name: string; slug: string; acronym: string; }>;
  onSchoolSelect: (name: string, slug: string) => void;
}

interface SchoolWithProfiles {
  name: string;
  slug: string;
  acronym: string;
  profilePictures: string[];
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
  const [schoolsWithProfiles, setSchoolsWithProfiles] = useState<SchoolWithProfiles[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch profile pictures for each school
  useEffect(() => {
    const fetchSchoolProfiles = async () => {
      try {
        const schoolProfilePromises = schools.map(async (school) => {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('pfp_url')
            .eq('school_slug', school.slug)
            .eq('is_visible', true)
            .not('pfp_url', 'is', null)
            .limit(4);
          
          const profilePictures = profiles?.map(p => p.pfp_url).filter(Boolean) || [];
          
          return {
            ...school,
            profilePictures
          };
        });
        
        const results = await Promise.all(schoolProfilePromises);
        setSchoolsWithProfiles(results);
      } catch (error) {
        console.error('Error fetching school profiles:', error);
        // Fallback to schools without profile pictures
        setSchoolsWithProfiles(schools.map(school => ({ ...school, profilePictures: [] })));
      }
    };

    fetchSchoolProfiles();
  }, [schools]);

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

  // Double schools for seamless loop - use schools with profiles when available
  const dataToUse = schoolsWithProfiles.length > 0 ? schoolsWithProfiles : schools.map(school => ({ ...school, profilePictures: [] }));
  const topRowSchools = [...dataToUse, ...dataToUse];
  const bottomRowSchools = [...dataToUse.slice(10), ...dataToUse, ...dataToUse.slice(0, 10)];

  // Component to render school icon with profiles or fallback
  const SchoolIcon = ({ school }: { school: SchoolWithProfiles }) => {
    if (school.profilePictures && school.profilePictures.length > 0) {
      // Show 1-4 profile pictures in a grid
      const pictures = school.profilePictures.slice(0, 4);
      
      if (pictures.length === 1) {
        return (
          <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 mb-2 md:mb-3">
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={pictures[0]} 
                alt={`Student from ${school.acronym}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-primary/40 to-primary/70 text-primary-foreground font-bold">
                {school.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      } else {
        // Multiple pictures in a small grid
        return (
          <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 mb-2 md:mb-3 grid grid-cols-2 gap-0.5">
            {pictures.map((pic, idx) => (
              <Avatar key={idx} className="w-full h-full">
                <AvatarImage 
                  src={pic} 
                  alt={`Student from ${school.acronym}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-r from-primary/40 to-primary/70 text-primary-foreground text-xs font-bold">
                  {school.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        );
      }
    }
    
    // Fallback to original letter circle
    return (
      <div className={`relative z-10 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary/40 to-primary/70 rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 ${!isMobile ? 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}>
        <span className="text-primary-foreground font-bold text-base md:text-lg">
          {school.name.charAt(0)}
        </span>
      </div>
    );
  };

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
              <SchoolIcon school={school} />
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
              <SchoolIcon school={school} />
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