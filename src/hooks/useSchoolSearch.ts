import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { schools, UC_CAMPUSES, School } from '@/data/schools';

// Normalize text for better matching
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

// Preprocess schools data for better search
const preprocessedSchools = schools.map(school => ({
  ...school,
  normalizedName: normalizeString(school.name),
  normalizedShortName: school.shortName ? normalizeString(school.shortName) : '',
  normalizedAliases: school.aliases.map(normalizeString),
  // Flatten all searchable text for Fuse
  searchableText: [
    school.name,
    school.shortName || '',
    ...school.aliases
  ].filter(Boolean).join(' ')
}));

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'shortName', weight: 0.6 },
    { name: 'aliases', weight: 1.0 },
    { name: 'searchableText', weight: 0.8 }
  ],
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  findAllMatches: true
};

let fuseInstance: Fuse<typeof preprocessedSchools[0]> | null = null;

const getFuseInstance = () => {
  if (!fuseInstance) {
    fuseInstance = new Fuse(preprocessedSchools, fuseOptions);
  }
  return fuseInstance;
};

export const useSchoolSearch = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeString(query);
    
    // Special case: UC system search
    if (normalizedQuery === 'uc' || normalizedQuery.startsWith('university of california')) {
      return UC_CAMPUSES.map(id => schools.find(s => s.id === id)!);
    }

    // Use Fuse.js for fuzzy search
    const fuse = getFuseInstance();
    const fuseResults = fuse.search(normalizedQuery);
    
    // Extract schools and limit to 8 results
    return fuseResults
      .slice(0, 8)
      .map(result => result.item as School);
  }, [query]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      search(searchQuery);
    }, 150),
    [search]
  );

  return {
    query,
    searchResults,
    search: debouncedSearch,
    isLoading
  };
};

// Simple debounce utility
function debounce<T extends any[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default useSchoolSearch;