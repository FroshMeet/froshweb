import React from 'react';
import { Button } from '@/components/ui/button';
import { getSchoolImageUrl, hasSchoolImage } from '@/utils/schoolImages';

interface SchoolCarouselProps {
  schools: Array<{ name: string; slug: string; acronym: string; }>;
  onSchoolSelect: (name: string, slug: string) => void;
}

export const SwipeableSchoolCarousel: React.FC<SchoolCarouselProps> = ({
  schools,
  onSchoolSelect,
}) => {
  // Get school initials fallback
  const getSchoolInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  // Alternating rows: odd positions (1,3,5...) on top, even positions (2,4,6...) on bottom
  const topRowBase = schools.filter((_, index) => index % 2 === 0); // indices 0,2,4... = positions 1,3,5...
  const bottomRowBase = schools.filter((_, index) => index % 2 === 1); // indices 1,3,5... = positions 2,4,6...
  
  // Double for seamless loop
  const topRowSchools = [...topRowBase, ...topRowBase];
  const bottomRowSchools = [...bottomRowBase, ...bottomRowBase];

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="animate-scroll-carousel-fast">
        {/* Top Row */}
        <div className="flex space-x-6 mb-6">
          {topRowSchools.map((school, index) => (
            <Button
              key={`top-${school.name}-${index}`}
              variant="outline"
              onClick={() => onSchoolSelect(school.name, school.slug)}
              className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden hover:shadow-[0_0_20px_rgba(96,165,250,0.25)] hover:border-primary/40 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 w-14 md:w-16 h-14 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/20 group-hover:shadow-[0_0_12px_rgba(96,165,250,0.2)] group-hover:border-primary/40">
                {hasSchoolImage(school.slug) ? (
                  <img 
                    src={getSchoolImageUrl(school.slug)!} 
                    alt={`${school.name} profile`}
                    width="64"
                    height="64"
                    loading="lazy"
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
              className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden hover:shadow-[0_0_20px_rgba(96,165,250,0.25)] hover:border-primary/40 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 w-14 md:w-16 h-14 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/20 group-hover:shadow-[0_0_12px_rgba(96,165,250,0.2)] group-hover:border-primary/40">
                {hasSchoolImage(school.slug) ? (
                  <img 
                    src={getSchoolImageUrl(school.slug)!} 
                    alt={`${school.name} profile`}
                    width="64"
                    height="64"
                    loading="lazy"
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
