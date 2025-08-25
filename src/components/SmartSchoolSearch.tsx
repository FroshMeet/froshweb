import React, { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { School } from '@/data/schools';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';
import { cn } from '@/lib/utils';

interface SmartSchoolSearchProps {
  onSelect: (school: School) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showHelperText?: boolean;
  className?: string;
  selectedSchool?: School | null;
}

export const SmartSchoolSearch: React.FC<SmartSchoolSearchProps> = ({
  onSelect,
  placeholder = "Search for your school…",
  autoFocus = false,
  showHelperText = false,
  className,
  selectedSchool
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
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  // Handle school selection
  const handleSchoolSelect = (school: School) => {
    onSelect(school);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
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

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current && resultsRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  return (
    <div className={cn("w-full", className)}>
      {/* Selected school display */}
      {selectedSchool && !isOpen && (
        <div className="mb-4 bg-primary/10 border border-primary/20 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">
              {selectedSchool.shortName || selectedSchool.name}
            </span>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
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
          className="h-12 pl-10 text-base bg-card/50 border-border/40 rounded-2xl focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Search results dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div 
            ref={resultsRef}
            className="absolute top-full left-0 right-0 bg-card border border-border rounded-2xl mt-2 z-[9999] shadow-2xl animate-fade-scale-in overflow-hidden max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="School search results"
          >
            {searchResults.map((school, index) => (
              <div
                key={school.id}
                ref={selectedIndex === index ? selectedItemRef : undefined}
                className={cn(
                  "p-4 cursor-pointer border-b border-border/40 last:border-b-0 transition-all duration-150",
                  "hover:bg-muted/50 focus:bg-muted/50",
                  selectedIndex === index && "bg-muted/50",
                  index === 0 && "rounded-t-2xl",
                  index === searchResults.length - 1 && "rounded-b-2xl"
                )}
                onClick={() => handleSchoolSelect(school)}
                role="option"
                aria-selected={selectedIndex === index}
                tabIndex={-1}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-primary">
                    {school.shortName || school.name}
                  </div>
                  {school.shortName && (
                    <div className="text-sm text-muted-foreground">
                      {school.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {isOpen && searchTerm.trim() && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-2xl mt-2 z-[9999] shadow-2xl p-4">
            <div className="text-sm text-muted-foreground text-center">
              No schools found. Try searching by name, acronym, or location.
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      {showHelperText && (
        <div className="mt-2 text-xs text-muted-foreground">
          Posting costs $5 per school
        </div>
      )}
    </div>
  );
};

export default SmartSchoolSearch;