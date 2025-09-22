import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { School } from '@/data/schools';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';
import { cn } from '@/lib/utils';

interface PredictiveSchoolSearchProps {
  onResultsChange: (schools: School[]) => void;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const PredictiveSchoolSearch: React.FC<PredictiveSchoolSearchProps> = ({
  onResultsChange,
  onQueryChange,
  placeholder = "Search schools... Try 'ivy', 'uc', or school names",
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  
  const { searchResults, search } = useSchoolSearch();

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    search(value);
    onQueryChange(value);
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(-1);
    
    // Update parent with results
    if (value.trim()) {
      // Results will be updated via useEffect when searchResults changes
    } else {
      onResultsChange([]);
    }
  };

  // Update parent when search results change
  useEffect(() => {
    if (searchTerm.trim()) {
      onResultsChange(searchResults);
    }
  }, [searchResults, searchTerm, onResultsChange]);

  // Handle school selection from dropdown
  const handleSchoolSelect = (school: School) => {
    setSearchTerm(school.shortName || school.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onResultsChange([school]);
    onQueryChange(school.shortName || school.name);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onResultsChange([]);
    onQueryChange('');
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < searchResults.length - 1 ? prev + 1 : prev;
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : -1;
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSchoolSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current && resultsRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Get category suggestions based on query
  const getCategorySuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    
    if ('ivy league'.includes(lowerQuery) && lowerQuery.length >= 2) {
      suggestions.push('Ivy League');
    }
    if ('uc system'.includes(lowerQuery) && lowerQuery.length >= 2) {
      suggestions.push('UC System');
    }
    if ('big ten'.includes(lowerQuery) && lowerQuery.length >= 3) {
      suggestions.push('Big Ten');
    }
    if ('california'.includes(lowerQuery) && lowerQuery.length >= 3) {
      suggestions.push('California');
    }
    if ('private'.includes(lowerQuery) && lowerQuery.length >= 3) {
      suggestions.push('Private');
    }
    if ('elite'.includes(lowerQuery) && lowerQuery.length >= 3) {
      suggestions.push('Elite');
    }
    
    return suggestions;
  };

  const categorySuggestions = searchTerm.trim() ? getCategorySuggestions(searchTerm) : [];

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary z-10" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.trim()) {
              setIsOpen(true);
            }
          }}
          className="h-12 pl-10 pr-10 text-base bg-card/50 border-primary/20 rounded-2xl focus:border-primary/50 focus:ring-primary/30 transition-all duration-200 backdrop-blur-sm"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search results dropdown */}
        {isOpen && (categorySuggestions.length > 0 || searchResults.length > 0) && (
          <div 
            ref={resultsRef}
            className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-lg border border-primary/20 rounded-2xl mt-2 z-[9999] shadow-2xl overflow-hidden max-h-96 overflow-y-auto animate-fade-scale-in"
            role="listbox"
            aria-label="Search results"
          >
            {/* Category suggestions */}
            {categorySuggestions.length > 0 && (
              <div className="p-3 border-b border-primary/10">
                <p className="text-xs text-primary font-medium mb-2 uppercase tracking-wide">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors bg-primary/10 text-primary border-primary/30"
                      onClick={() => {
                        setSearchTerm(category.toLowerCase());
                        search(category.toLowerCase());
                        onQueryChange(category.toLowerCase());
                        setIsOpen(false);
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* School results */}
            {searchResults.length > 0 && (
              <div>
                {categorySuggestions.length > 0 && (
                  <p className="text-xs text-primary font-medium px-3 pt-3 pb-2 uppercase tracking-wide">Schools</p>
                )}
                {searchResults.map((school, index) => (
                  <div
                    key={school.id}
                    ref={selectedIndex === index ? selectedItemRef : undefined}
                    className={cn(
                      "p-4 cursor-pointer border-b border-primary/5 last:border-b-0 transition-all duration-150",
                      "hover:bg-primary/10 focus:bg-primary/10",
                      selectedIndex === index && "bg-primary/10",
                      index === searchResults.length - 1 && "rounded-b-2xl"
                    )}
                    onClick={() => handleSchoolSelect(school)}
                    role="option"
                    aria-selected={selectedIndex === index}
                    tabIndex={-1}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary text-sm uppercase tracking-wide mb-1">
                          {school.shortName || school.name}
                        </div>
                        {school.shortName && (
                          <div className="text-xs text-muted-foreground truncate">
                            {school.name}
                          </div>
                        )}
                        {school.categories && school.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {school.categories.slice(0, 3).map((category) => (
                              <Badge
                                key={category}
                                variant="outline"
                                className="text-xs px-2 py-0.5 border-primary/30 text-primary/80"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {searchTerm.trim() && categorySuggestions.length === 0 && searchResults.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm mb-2">
                  No schools found for "{searchTerm}"
                </p>
                <p className="text-xs text-muted-foreground">
                  Try searching by school name, abbreviation, or category like "ivy" or "uc"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveSchoolSearch;