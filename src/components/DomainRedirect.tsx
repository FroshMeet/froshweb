import { useEffect } from 'react';

/**
 * DomainRedirect Component
 * Handles 301-style redirect from getfrosh.com to frosh.app
 * Preserves all URL paths and parameters
 */
export const DomainRedirect = () => {
  useEffect(() => {
    const currentDomain = window.location.hostname;
    
    // Check if user is on getfrosh.com or www.getfrosh.com
    if (currentDomain === 'getfrosh.com' || currentDomain === 'www.getfrosh.com') {
      // Preserve the full path and query parameters
      const fullPath = window.location.pathname + window.location.search + window.location.hash;
      
      // Redirect to frosh.app with the same path
      const newUrl = `https://frosh.app${fullPath}`;
      
      // Use replace to avoid adding to browser history (acts like 301)
      window.location.replace(newUrl);
    }
  }, []);

  return null;
};
