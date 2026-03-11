import React, { useState, useMemo } from 'react';
import { Search, Music, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SONGS } from '@/data/songs';
import { StepProps } from './types';

const StepSong: React.FC<StepProps> = ({ data, onChange }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return SONGS.slice(0, 8);
    const q = query.toLowerCase();
    return SONGS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query]);

  const hasSong = data.songTitle.length > 0;

  const selectSong = (title: string, artist: string) => {
    onChange({ songTitle: title, songArtist: artist });
  };

  const clearSong = () => {
    onChange({ songTitle: '', songArtist: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Add a song to your post</h2>
        <p className="text-muted-foreground mt-2 text-sm">Pick a song that represents you.</p>
      </div>

      {hasSong ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border-2 border-primary">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-bold truncate">{data.songTitle}</p>
            <p className="text-muted-foreground text-sm truncate">{data.songArtist}</p>
          </div>
          <button onClick={clearSong} className="p-2 rounded-full hover:bg-card transition-colors shrink-0">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs or artists"
              className="h-14 pl-12 text-lg rounded-2xl bg-card border-border focus:border-primary"
              autoFocus
            />
          </div>

          <div className="space-y-1 max-h-[40vh] overflow-y-auto">
            {results.map((song, i) => (
              <button
                key={`${song.title}-${song.artist}-${i}`}
                onClick={() => selectSong(song.title, song.artist)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate">{song.title}</p>
                  <p className="text-muted-foreground text-xs truncate">{song.artist}</p>
                </div>
              </button>
            ))}
            {results.length === 0 && query.trim() && (
              <p className="text-center text-muted-foreground py-6 text-sm">No songs found</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Songs must be available on Instagram. If unavailable we may choose a similar track.
          </p>
        </>
      )}
    </div>
  );
};

export default StepSong;
