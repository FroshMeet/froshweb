import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  className?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  lazy = true,
  className = '',
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      className={`${className} ${!isLoaded && isInView ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};
