import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { StepProps } from './types';

const BIO_LIMIT = 250;

const StepBio: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Tell your classmates about you</h2>
        <p className="text-muted-foreground mt-2 text-sm">Major, hometown, interests, anything goes.</p>
      </div>

      <div>
        <Textarea
          value={data.bio}
          onChange={(e) => {
            if (e.target.value.length <= BIO_LIMIT) onChange({ bio: e.target.value });
          }}
          placeholder="Hey I'm Kian — incoming business major from LA. Love startups, gym, and late night food runs."
          className="min-h-[180px] text-base rounded-2xl bg-card border-border resize-none p-4 leading-relaxed"
          maxLength={BIO_LIMIT}
          autoFocus
        />
        <p className="text-sm text-muted-foreground mt-2 text-right tabular-nums">
          {data.bio.length}/{BIO_LIMIT}
        </p>
      </div>
    </div>
  );
};

export default StepBio;
