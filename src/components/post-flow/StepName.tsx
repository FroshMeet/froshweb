import React from 'react';
import { Input } from '@/components/ui/input';
import { StepProps } from './types';

const StepName: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Post Yourself to Meet Classmates</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          <span className="text-primary font-semibold text-base sm:text-lg">It's Free.</span> Introduce yourself to your incoming class.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder="First name"
          className="h-14 text-lg rounded-2xl bg-card border-border focus:border-primary"
          autoFocus
        />
        <Input
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder="Last name (optional)"
          className="h-14 text-lg rounded-2xl bg-card border-border focus:border-primary"
        />
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">@</span>
          <Input
            value={data.username}
            onChange={(e) => onChange({ username: e.target.value })}
            placeholder="instagram handle"
            className="h-14 pl-10 text-lg rounded-2xl bg-card border-border focus:border-primary"
          />
        </div>
        {data.username.trim() && (
          <p className="text-sm text-primary font-medium">@{data.username.replace('@', '').trim()}</p>
        )}
      </div>
    </div>
  );
};

export default StepName;
