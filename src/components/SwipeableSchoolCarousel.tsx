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
  const getSchoolInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  const topRowBase = schools.filter((_, index) => index % 2 === 0);
  const bottomRowBase = schools.filter((_, index) => index % 2 === 1);
  
  const topRowSchools = [...topRowBase, ...topRowBase];
  const bottomRowSchools = [...bottomRowBase, ...bottomRowBase];

  const cardClass = "flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base transition-all duration-500 bg-card/40 border-border/40 group relative overflow-hidden hover:shadow-[0_0_15px_rgba(1,92,210,0.12)] hover:border-primary/30 hover:scale-[1.03]";
  const overlayClass = "absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
  const avatarClass = "relative z-10 w-14 md:w-16 h-14 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 overflow-hidden border-2 border-primary/15 group-hover:shadow-[0_0_8px_rgba(1,92,210,0.1)] group-hover:border-primary/30";

  const renderCard = (school: typeof schools[0], prefix: string, index: number) => (
    <Button
      key={`${prefix}-${school.name}-${index}`}
      variant="outline"
      onClick={() => onSchoolSelect(school.name, school.slug)}
      className={cardClass}
    >
      <div className={overlayClass}></div>
      <div className={avatarClass}>
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
  );

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="animate-scroll-carousel-fast">
        <div className="flex space-x-6 mb-6">
          {topRowSchools.map((school, index) => renderCard(school, 'top', index))}
        </div>
        <div className="flex space-x-6" style={{ marginLeft: '5rem' }}>
          {bottomRowSchools.map((school, index) => renderCard(school, 'bottom', index))}
        </div>
      </div>
    </div>
  );
};

export default SwipeableSchoolCarousel;
