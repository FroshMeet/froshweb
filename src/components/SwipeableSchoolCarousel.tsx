import React from 'react';
import { Button } from '@/components/ui/button';

// Import optimized WebP logos
import harvardLogo from "@/assets/logos/harvard.webp";
import stanfordLogo from "@/assets/logos/stanford.webp";
import mitLogo from "@/assets/logos/mit.webp";
import uclaLogo from "@/assets/logos/ucla.webp";
import yaleLogo from "@/assets/logos/yale.webp";
import uscLogo from "@/assets/logos/usc.webp";
import ucBerkeleyLogo from "@/assets/logos/uc-berkeley.webp";
import nyuLogo from "@/assets/logos/nyu.webp";
import umichLogo from "@/assets/logos/umich.webp";
import dukeLogo from "@/assets/logos/duke.webp";
import princetonLogo from "@/assets/logos/princeton.webp";
import northwesternLogo from "@/assets/logos/northwestern.webp";
import upennLogo from "@/assets/logos/upenn.webp";
import columbiaLogo from "@/assets/logos/columbia.webp";

interface SchoolCarouselProps {
  schools: Array<{ name: string; slug: string; acronym: string; }>;
  onSchoolSelect: (name: string, slug: string) => void;
}

export const SwipeableSchoolCarousel: React.FC<SchoolCarouselProps> = ({
  schools,
  onSchoolSelect,
}) => {
  // Map school slug to school ID for logo lookup - using approved school slugs
  const getSchoolId = (slug: string): string => {
    const slugToIdMap: Record<string, string> = {
      'harvard': 'harvard',
      'stanford': 'stanford',
      'mit': 'mit',
      'ucla': 'ucla',
      'yale': 'yale',
      'usc': 'usc',
      'ucberkeley': 'uc-berkeley', // Map approved slug to logo ID
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
      'stanford': stanfordLogo,
      'mit': mitLogo,
      'ucla': uclaLogo,
      'yale': yaleLogo,
      'usc': uscLogo,
      'uc-berkeley': ucBerkeleyLogo,
      'nyu': nyuLogo,
      'umich': umichLogo,
      'duke': dukeLogo,
      'princeton': princetonLogo,
      'northwestern': northwesternLogo,
      'upenn': upennLogo,
      'columbia': columbiaLogo,
    };
    return logoMap[schoolId];
  };

  // Get school initials fallback
  const getSchoolInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  // Double schools for seamless loop
  const topRowSchools = [...schools, ...schools];
  const bottomRowSchools = [...schools.slice(10), ...schools, ...schools.slice(0, 10)];

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
              className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-primary/60">
                {getSchoolLogo(school.slug) ? (
                  <img 
                    src={getSchoolLogo(school.slug)} 
                    alt={`${school.name} logo`}
                    width="48"
                    height="48"
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
              className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-primary/60">
                {getSchoolLogo(school.slug) ? (
                  <img 
                    src={getSchoolLogo(school.slug)} 
                    alt={`${school.name} logo`}
                    width="48"
                    height="48"
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