import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Instagram, X, Check, ExternalLink, Plus, GripVertical } from 'lucide-react';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CLASS_YEAR_OPTIONS = [
  { value: '2030', label: '2030', subtitle: 'Incoming Freshman' },
  { value: '2029', label: '2029', subtitle: 'Transfer' },
  { value: '2028', label: '2028', subtitle: 'Transfer' },
  { value: '2027', label: '2027', subtitle: 'Transfer' },
];

const PostFlow: React.FC = () => {
  const { school: schoolSlug } = useParams<{ school?: string }>();
  const navigate = useNavigate();

  const schoolData = schoolSlug ? APPROVED_SCHOOLS[schoolSlug] : null;
  const isSchoolPreselected = !!schoolData;

  // Steps: name -> instagram -> school (conditional) -> bio -> classYear -> photos
  const steps = useMemo(() => {
    const s: string[] = ['name', 'instagram'];
    if (!isSchoolPreselected) s.push('school');
    s.push('bio', 'classYear', 'photos');
    return s;
  }, [isSchoolPreselected]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(schoolSlug || '');
  const [bio, setBio] = useState('');
  const [classYear, setClassYear] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  const selectedSchoolData = APPROVED_SCHOOLS[selectedSchool];
  const displaySchoolName = schoolData?.displayName || selectedSchoolData?.displayName || '';
  const instagramHandle = schoolData?.instagramUsername || selectedSchoolData?.instagramUsername || '';
  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');

  const sortedSchools = useMemo(() => {
    return Object.entries(APPROVED_SCHOOLS).sort((a, b) => a[1].name.localeCompare(b[1].name));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'name': return firstName.trim().length > 0;
      case 'instagram': return username.trim().length > 0;
      case 'school': return selectedSchool.length > 0;
      case 'bio': return true;
      case 'classYear': return classYear.length > 0;
      case 'photos': return photos.length >= 3 && photos.length <= 8;
      default: return false;
    }
  }, [currentStep, firstName, username, selectedSchool, classYear, photos]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = photos.length + files.length;
    if (total > 8) { toast.error('Maximum 8 photos allowed'); return; }
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    const [movedPhoto] = newPhotos.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);
    newPhotos.splice(index, 0, movedPhoto);
    newPreviews.splice(index, 0, movedPreview);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const uploadPhotos = async (): Promise<string[]> => {
    const timestamp = Date.now();
    const uploadPromises = photos.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${index}.${fileExt}`;
      const filePath = `${selectedSchool}/${fileName}`;
      const { error } = await supabase.storage.from('post-images').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
      return data.publicUrl;
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const imageUrls = await uploadPhotos();
      const { error } = await supabase.from('posts').insert({
        username: username.replace('@', '').trim(),
        name: fullName || null,
        school: selectedSchoolData?.name || schoolData?.name || '',
        school_slug: selectedSchool,
        bio: bio.trim() || null,
        class_year: classYear,
        image_urls: imageUrls,
      });
      if (error) throw error;
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
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
              onClick={() => navigate(schoolSlug ? `/${schoolSlug}` : '/community')}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90"
            >
              View School Page
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setCurrentStepIndex(0);
                setFirstName('');
                setLastName('');
                setUsername('');
                setBio('');
                setClassYear('');
                setPhotos([]);
                setPhotoPreviews([]);
                if (!isSchoolPreselected) setSelectedSchool('');
              }}
              className="w-full h-14 text-lg font-bold rounded-2xl border-border hover:bg-card"
            >
              Submit Another Post
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={currentStepIndex > 0 ? handleBack : () => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground font-medium">Step {currentStepIndex + 1} of {totalSteps}</span>
            <div className="w-9" />
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-card" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
            {isSchoolPreselected ? `Post to ${displaySchoolName}` : 'Post Yourself to Meet Classmates'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            <span className="text-primary font-semibold">It's free.</span> Introduce yourself to your incoming class.
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          {currentStep === 'name' && (
            <StepContainer title="What's your name?" subtitle="This will be shown on your post">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="h-16 text-lg rounded-2xl bg-card border-border focus:border-primary"
                autoFocus
              />
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name (optional)"
                className="h-16 text-lg rounded-2xl bg-card border-border focus:border-primary mt-3"
              />
            </StepContainer>
          )}

          {currentStep === 'instagram' && (
            <StepContainer title="What's your Instagram username?" subtitle="This is how classmates will find you">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">@</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="h-16 pl-10 text-lg rounded-2xl bg-card border-border focus:border-primary"
                  autoFocus
                />
              </div>
              {username.trim() && (
                <p className="text-sm text-primary font-medium mt-3">@{username.replace('@', '').trim()}</p>
              )}
            </StepContainer>
          )}

          {currentStep === 'school' && (
            <StepContainer title="Which school are you attending?" subtitle="Select from our partner schools">
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="h-16 text-lg rounded-2xl bg-card border-border">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {sortedSchools.map(([slug, school]) => (
                    <SelectItem key={slug} value={slug} className="text-base py-3">{school.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </StepContainer>
          )}

          {currentStep === 'bio' && (
            <StepContainer title="Tell your classmates about yourself" subtitle="Major, hometown, interests, etc.">
              <Textarea
                value={bio}
                onChange={(e) => { if (e.target.value.length <= 200) setBio(e.target.value); }}
                placeholder="I'm from LA, studying Computer Science. I love hiking, photography, and finding the best coffee spots ☕️"
                className="min-h-[160px] text-lg rounded-2xl bg-card border-border resize-none p-4"
                maxLength={200}
                autoFocus
              />
              <p className="text-sm text-muted-foreground mt-2 text-right">{bio.length}/200</p>
            </StepContainer>
          )}

          {currentStep === 'classYear' && (
            <StepContainer title="What class are you?" subtitle="Select your graduating class">
              <div className="grid gap-3">
                {CLASS_YEAR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setClassYear(option.value)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      classYear === option.value
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-foreground">{option.label}</span>
                        <p className="text-muted-foreground mt-0.5">{option.subtitle}</p>
                      </div>
                      {classYear === option.value && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </StepContainer>
          )}

          {currentStep === 'photos' && (
            <StepContainer title="Add photos for your post" subtitle="Upload 3–8 images. Drag to reorder.">
              <div className="grid grid-cols-3 gap-3">
                {photoPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-2xl overflow-hidden group cursor-grab ${dragIndex === index ? 'opacity-50 scale-95' : ''} transition-all`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        COVER
                      </span>
                    )}
                  </div>
                ))}
                {photos.length < 8 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add</span>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {photos.length}/8 photos {photos.length < 3 && `(${3 - photos.length} more needed)`}
              </p>
            </StepContainer>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 pb-4">
          {currentStep === 'photos' ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="w-full h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit Post'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                Next <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          )}
          {currentStep === 'photos' && (
            <p className="text-center text-sm text-muted-foreground mt-3">Your post will appear on the school page instantly.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StepContainer: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default PostFlow;
