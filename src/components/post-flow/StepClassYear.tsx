import React from 'react';
import { Check } from 'lucide-react';
import { StepProps } from './types';

const CLASS_YEAR_OPTIONS = [
  { value: '2030', label: 'Class of 2030', description: 'Freshman' },
  { value: '2029 Transfer', label: 'Class of 2029', description: 'Transfer' },
  { value: '2028', label: 'Class of 2028', description: 'Sophomore' },
  { value: '2027', label: 'Class of 2027', description: 'Junior' },
];

const StepClassYear: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">What year are you?</h2>
        <p className="text-muted-foreground mt-2 text-sm">Select your class year.</p>
      </div>

      <div className="space-y-3">
        {CLASS_YEAR_OPTIONS.map((option) => {
          const isSelected = data.classYear === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange({ classYear: option.value })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <div>
                <span className="text-base font-semibold text-foreground">{option.label}</span>
                <span className="text-sm text-muted-foreground ml-2">{option.description}</span>
              </div>
              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepClassYear;
