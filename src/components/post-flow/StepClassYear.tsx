import React from 'react';
import { StepProps } from './types';

const CLASS_YEAR_OPTIONS = [
  { value: '2030', label: '2030', description: 'Incoming Freshman' },
  { value: '2029 Transfer', label: '2029', description: 'Transfer' },
  { value: '2028', label: '2028', description: 'Transfer' },
  { value: '2027', label: '2027', description: 'Transfer' },
];

const StepClassYear: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">What class are you?</h2>
        <p className="text-muted-foreground mt-2 text-sm">Select your graduating class</p>
      </div>

      <div className="space-y-4">
        {CLASS_YEAR_OPTIONS.map((option) => {
          const isSelected = data.classYear === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange({ classYear: option.value })}
              className={`w-full flex flex-col items-start p-5 sm:p-6 rounded-2xl border transition-all duration-200 text-left ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <span className="text-2xl sm:text-3xl font-black text-foreground">{option.label}</span>
              <span className="text-sm text-muted-foreground mt-1">{option.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepClassYear;
