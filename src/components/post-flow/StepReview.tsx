import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Music, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { INTERESTS } from '@/data/interests';
import { StepProps } from './types';

interface StepReviewProps extends StepProps {
  onGoToStep: (step: string) => void;
}

const StepReview: React.FC<StepReviewProps> = ({ data, onGoToStep }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const school = APPROVED_SCHOOLS[data.schoolSlug];
  const fullName = [data.firstName.trim(), data.lastName.trim()].filter(Boolean).join(' ');
  const handle = data.username.replace('@', '').trim();

  const selectedInterests = INTERESTS.filter((i) => data.interests.includes(i.id));

  const prevPhoto = () => setPhotoIndex((i) => (i > 0 ? i - 1 : data.photoPreviews.length - 1));
  const nextPhoto = () => setPhotoIndex((i) => (i < data.photoPreviews.length - 1 ? i + 1 : 0));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">Review your post</h2>
        <p className="text-muted-foreground mt-2 text-sm">Looking good? Hit post when ready.</p>
      </div>

      {/* Preview Card */}
      <div className="rounded-3xl border-2 border-border bg-card overflow-hidden">
        {/* Photo Carousel */}
        {data.photoPreviews.length > 0 && (
          <div className="relative aspect-[3/4] bg-background">
            <img
              src={data.photoPreviews[photoIndex]}
              alt=""
              className="w-full h-full object-cover"
            />
            {data.photoPreviews.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {data.photoPreviews.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === photoIndex ? 'bg-primary w-4' : 'bg-foreground/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Edit overlay */}
            <button
              onClick={() => onGoToStep('photos')}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <Pencil className="w-4 h-4 text-foreground" />
            </button>
          </div>
        )}

        {/* Info */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground">{fullName || 'Your Name'}</h3>
              {handle && <p className="text-primary font-medium text-sm">@{handle}</p>}
              <p className="text-muted-foreground text-xs mt-1">
                {school?.displayName || 'Your School'} · Class of 2030
              </p>
            </div>
            <button
              onClick={() => onGoToStep('name')}
              className="text-primary text-xs font-semibold hover:underline shrink-0"
            >
              Edit
            </button>
          </div>

          {data.bio && (
            <div className="flex items-start justify-between gap-2">
              <p className="text-foreground text-sm leading-relaxed">{data.bio}</p>
              <button
                onClick={() => onGoToStep('bio')}
                className="text-primary text-xs font-semibold hover:underline shrink-0"
              >
                Edit
              </button>
            </div>
          )}

          {data.songTitle && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-4 h-4 text-primary shrink-0" />
                <p className="text-foreground text-sm font-medium truncate">
                  {data.songTitle} — {data.songArtist}
                </p>
              </div>
              <button
                onClick={() => onGoToStep('song')}
                className="text-primary text-xs font-semibold hover:underline shrink-0"
              >
                Edit
              </button>
            </div>
          )}

          {selectedInterests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Interests</p>
                <button
                  onClick={() => onGoToStep('interests')}
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedInterests.map((interest) => (
                  <span
                    key={interest.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {interest.emoji} {interest.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepReview;
