import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { INTERESTS } from '@/data/interests';
import { StepProps } from './types';

const MAX_INTERESTS = 20;

const StepInterests: React.FC<StepProps> = ({ data, onChange }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return INTERESTS;
    const q = query.toLowerCase();
    return INTERESTS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id: string) => {
    const current = data.interests;
    if (current.includes(id)) {
      onChange({ interests: current.filter((i) => i !== id) });
    } else if (current.length < MAX_INTERESTS) {
      onChange({ interests: [...current, id] });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Add your interests</h2>
        <p className="text-muted-foreground mt-2 text-sm">Choose things you're into.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search interests"
          className="h-12 pl-12 text-base rounded-2xl bg-card border-border focus:border-primary"
        />
      </div>

      <p className="text-sm text-muted-foreground tabular-nums">
        {data.interests.length} / {MAX_INTERESTS} selected
      </p>

      <div className="flex flex-wrap gap-2 max-h-[45vh] overflow-y-auto pb-2">
        {filtered.map((interest) => {
          const isSelected = data.interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]'
                  : 'bg-card border border-border text-foreground hover:border-primary/40'
              }`}
            >
              <span>{interest.emoji}</span>
              <span>{interest.label}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm py-4 w-full text-center">No interests found</p>
        )}
      </div>
    </div>
  );
};

export default StepInterests;
