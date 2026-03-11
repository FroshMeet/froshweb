import React from 'react';
import { Music, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StepProps } from './types';

const StepSong: React.FC<StepProps> = ({ data, onChange }) => {
  const hasSong = data.songTitle.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Add a song to your post</h2>
        <p className="text-muted-foreground mt-2 text-sm">Pick a song that represents you.</p>
      </div>

      {hasSong && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/30">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <p className="text-foreground font-semibold text-sm truncate flex-1">
            {data.songTitle}{data.songArtist ? ` — ${data.songArtist}` : ''}
          </p>
          <button
            onClick={() => onChange({ songTitle: '', songArtist: '' })}
            className="p-2 rounded-full hover:bg-card transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <Input
          value={data.songTitle}
          onChange={(e) => onChange({ songTitle: e.target.value })}
          placeholder="Your Favorite Song"
          className="h-14 text-base rounded-2xl bg-card border-border focus:border-primary"
        />
        <Input
          value={data.songArtist}
          onChange={(e) => onChange({ songArtist: e.target.value })}
          placeholder="Artist (optional)"
          className="h-12 text-base rounded-2xl bg-card border-border focus:border-primary"
        />
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Songs must exist on Instagram.<br />
        If unavailable your post may not include a song.
      </p>
    </div>
  );
};

export default StepSong;
