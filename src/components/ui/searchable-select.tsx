
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Card } from './card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchOption {
  value: string;
  label: string;
  searchTerms?: string[];
}

interface SearchableSelectProps {
  options: SearchOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Search and select...",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart search function (copied from Homepage)
  const searchOptions = (query: string): SearchOption[] => {
    if (!query.trim()) return options.slice(0, 10);

    const searchTerm = query.toLowerCase().trim();
    const results: Array<SearchOption & { score: number }> = [];

    options.forEach(option => {
      const searchableText = [
        option.label.toLowerCase(),
        ...(option.searchTerms?.map(term => term.toLowerCase()) || [])
      ];

      let bestScore = 0;

      searchableText.forEach(text => {
        // Exact match (highest priority)
        if (text === searchTerm) {
          bestScore = Math.max(bestScore, 100);
        }
        // Starts with (medium priority)
        else if (text.startsWith(searchTerm)) {
          bestScore = Math.max(bestScore, 50);
        }
        // Contains (lowest priority)
        else if (text.includes(searchTerm)) {
          bestScore = Math.max(bestScore, 25);
        }
      });

      if (bestScore > 0) {
        results.push({ ...option, score: bestScore });
      }
    });

    return results
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, 10);
  };

  const filteredOptions = searchOptions(searchQuery);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(opt => opt.value === value);
      if (selectedOption) {
        setDisplayValue(selectedOption.label);
      }
    } else {
      setDisplayValue('');
    }
  }, [value, options]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: SearchOption) => {
    onValueChange(option.value);
    setDisplayValue(option.label);
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={isOpen ? searchQuery : displayValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="cursor-pointer"
        autoComplete="off"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Card className="absolute bg-background border border-border shadow-2xl rounded-lg pointer-events-auto"
                style={{
                  top: containerRef.current ? containerRef.current.getBoundingClientRect().bottom + 4 : 0,
                  left: containerRef.current ? containerRef.current.getBoundingClientRect().left : 0,
                  width: containerRef.current ? containerRef.current.getBoundingClientRect().width : 'auto',
                  maxHeight: '320px' // Show ~10 options at 32px each
                }}>
            <div className="overflow-y-auto max-h-80 custom-scrollbar">
              <div className="p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span>{option.label}</span>
                    {value === option.value && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
