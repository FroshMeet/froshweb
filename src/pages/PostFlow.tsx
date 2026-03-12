import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Instagram, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostFormData } from '@/components/post-flow/types';
import StepSchool from '@/components/post-flow/StepSchool';
import StepName from '@/components/post-flow/StepName';
import StepClassYear from '@/components/post-flow/StepClassYear';
import StepPhotos from '@/components/post-flow/StepPhotos';
import StepBio from '@/components/post-flow/StepBio';
import StepSong from '@/components/post-flow/StepSong';
import StepInterests from '@/components/post-flow/StepInterests';
import StepReview from '@/components/post-flow/StepReview';

const PostFlow: React.FC = () => {
  const { school: schoolSlug } = useParams<{ school?: string }>();
  const navigate = useNavigate();

  const schoolData = schoolSlug ? APPROVED_SCHOOLS[schoolSlug] : null;
  const isSchoolPreselected = !!schoolData;

  const steps = useMemo(() => {
    const s: string[] = [];
    if (!isSchoolPreselected) s.push('school');
    s.push('name', 'classYear', 'photos', 'bio', 'song', 'interests', 'review');
    return s;
  }, [isSchoolPreselected]);

  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<PostFormData>({
    schoolSlug: schoolSlug || '',
    firstName: '',
    lastName: '',
    username: '',
    photos: [],
    photoPreviews: [],
    bio: '',
    songTitle: '',
    songArtist: '',
    interests: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPostId, setSubmittedPostId] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const selectedSchoolData = APPROVED_SCHOOLS[data.schoolSlug];
  const displaySchoolName = schoolData?.displayName || selectedSchoolData?.displayName || '';
  const instagramHandle = schoolData?.instagramUsername || selectedSchoolData?.instagramUsername || '';

  const handleChange = useCallback((updates: Partial<PostFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'school':
        return data.schoolSlug.length > 0;
      case 'name':
        return data.firstName.trim().length > 0 && data.username.trim().length > 0;
      case 'photos':
        return data.photos.length >= 1;
      case 'bio':
        return true;
      case 'song':
        return true;
      case 'interests':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  const next = () => {
    if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
  };
  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };
  const goToStep = (step: string) => {
    const idx = steps.indexOf(step);
    if (idx >= 0) setStepIndex(idx);
  };

  const isOptionalStep = currentStep === 'song' || currentStep === 'interests';

  const uploadPhotos = async (): Promise<string[]> => {
    const timestamp = Date.now();
    const slug = data.schoolSlug;
    const uploadPromises = data.photos.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${index}.${fileExt}`;
      const filePath = `${slug}/${fileName}`;
      const { error } = await supabase.storage.from('post-images').upload(filePath, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(filePath);
      return urlData.publicUrl;
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const imageUrls = await uploadPhotos();
      const fullName = [data.firstName.trim(), data.lastName.trim()].filter(Boolean).join(' ');

      const insertPayload: Record<string, unknown> = {
        username: data.username.replace('@', '').trim(),
        name: fullName || null,
        school: selectedSchoolData?.name || schoolData?.name || '',
        school_slug: data.schoolSlug,
        bio: data.bio.trim() || null,
        class_year: '2030',
        image_urls: imageUrls,
      };

      // Include song & interests if columns exist (added via migration)
      if (data.songTitle) insertPayload.song_title = data.songTitle;
      if (data.songArtist) insertPayload.song_artist = data.songArtist;
      if (data.interests.length > 0) insertPayload.interests = data.interests;

      const { data: insertedData, error } = await supabase
        .from('posts')
        .insert(insertPayload as any)
        .select('id')
        .single();

      if (error) throw error;
      setSubmittedPostId(insertedData?.id || null);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-foreground">You're in! 🎉</h1>
            <p className="text-lg text-muted-foreground">
              Your post is now live on the {displaySchoolName || 'school'} page.
            </p>
          </div>

          {instagramHandle && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <p className="text-muted-foreground text-sm">Check your feature on</p>
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                @{instagramHandle}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => {
                const slug = data.schoolSlug || schoolSlug || '';
                navigate(slug ? `/${slug}?post=${submittedPostId}` : '/community');
              }}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90"
            >
              View Your Post
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const slug = data.schoolSlug || schoolSlug || '';
                navigate(slug ? `/${slug}#student-posts` : '/community');
              }}
              className="w-full h-14 text-lg font-bold rounded-2xl border-border hover:bg-card"
            >
              See Other Students
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step Content ──
  const renderStep = () => {
    switch (currentStep) {
      case 'school':
        return <StepSchool data={data} onChange={handleChange} />;
      case 'name':
        return <StepName data={data} onChange={handleChange} />;
      case 'photos':
        return <StepPhotos data={data} onChange={handleChange} />;
      case 'bio':
        return <StepBio data={data} onChange={handleChange} />;
      case 'song':
        return <StepSong data={data} onChange={handleChange} />;
      case 'interests':
        return <StepInterests data={data} onChange={handleChange} />;
      case 'review':
        return <StepReview data={data} onChange={handleChange} onGoToStep={goToStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={stepIndex > 0 ? back : () => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground font-medium tabular-nums">
              Step {stepIndex + 1} of {totalSteps}
            </span>
            <div className="w-9" />
          </div>
          <Progress value={progress} className="h-1.5 bg-card [&>div]:transition-all [&>div]:duration-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        <div key={`step-${stepIndex}`} className="flex-1 animate-fade-in">
          {renderStep()}
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 pb-4 space-y-3">
          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                `Post to ${displaySchoolName || 'Your School'} 2030 →`
              )}
            </Button>
          ) : (
            <div className="flex gap-3">
              {isOptionalStep && (
                <Button
                  variant="ghost"
                  onClick={next}
                  className="flex-1 h-14 text-lg font-medium rounded-2xl text-muted-foreground hover:text-foreground"
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={next}
                disabled={!canProceed()}
                className={`h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40 ${
                  isOptionalStep ? 'flex-1' : 'w-full'
                }`}
              >
                Next →
              </Button>
            </div>
          )}

          {currentStep === 'review' && (
            <p className="text-center text-sm text-muted-foreground">
              Your post will appear on the school page instantly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostFlow;
