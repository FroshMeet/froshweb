import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { StepProps } from './types';

const StepSchool: React.FC<StepProps> = ({ data, onChange }) => {
  const [query, setQuery] = useState('');

  const schools = useMemo(() => {
    const all = Object.entries(APPROVED_SCHOOLS)
      .map(([slug, s]) => ({ slug, name: s.name, displayName: s.displayName }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(s =>
      s.name.toLowerCase().includes(q) || s.displayName.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Where are you headed?</h2>
        <p className="text-muted-foreground mt-2 text-sm">Search for your university.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your university"
          className="h-14 pl-12 text-lg rounded-2xl bg-card border-border focus:border-primary"
          autoFocus
        />
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {schools.map((school) => {
          const isSelected = data.schoolSlug === school.slug;
          return (
            <button
              key={school.slug}
              onClick={() => onChange({ schoolSlug: school.slug })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <span className="text-base font-semibold text-foreground">{school.displayName}</span>
              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
        {schools.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No schools found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default StepSchool;
