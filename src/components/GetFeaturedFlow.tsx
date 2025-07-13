import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Upload, X, ArrowLeft, ArrowRight, Check, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SCHOOL_DATABASE } from "@/config/schoolDatabase";

interface GetFeaturedFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedSchool?: string;
}

const STEPS = [
  { id: 'school', title: 'Choose Your School', description: 'Select your university to get featured' },
  { id: 'handle', title: 'Instagram Handle', description: 'Your @username for tagging' },
  { id: 'bio', title: 'Tell Your Story', description: 'Share a bit about yourself' },
  { id: 'photos', title: 'Upload Photos', description: 'Show your personality' },
  { id: 'integration', title: 'School Page Integration', description: 'Appear on your school\'s FroshMeet page' },
  { id: 'payment', title: 'Get Featured', description: 'Secure your spot for $5' }
];

export const GetFeaturedFlow: React.FC<GetFeaturedFlowProps> = ({ open, onOpenChange, preSelectedSchool }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState(preSelectedSchool || "");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [showOnSchoolPage, setShowOnSchoolPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedSchool(preSelectedSchool || "");
    setInstagramHandle("");
    setBio("");
    setPhotos([]);
    setShowOnSchoolPage(true);
    setIsSubmitting(false);
    setIsCompleted(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photos.length + files.length > 10) {
      toast({
        title: "Too many photos",
        description: "You can upload up to 10 photos maximum",
        variant: "destructive",
      });
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Please select photos under 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    setPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const reorderPhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, removed);
    setPhotos(newPhotos);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedSchool !== "";
      case 1: return instagramHandle.length > 0;
      case 2: return bio.length > 0;
      case 3: return photos.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    
    // Simulate Stripe payment
    setTimeout(() => {
      setIsCompleted(true);
      setIsSubmitting(false);
      
      // Add confetti effect
      const confetti = document.createElement('div');
      confetti.innerHTML = '🎉';
      confetti.style.position = 'fixed';
      confetti.style.fontSize = '2rem';
      confetti.style.zIndex = '9999';
      confetti.style.animation = 'confetti 3s ease-out forwards';
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);
      
      toast({
        title: "🔥 You're in!",
        description: "We'll feature your profile soon on Instagram!",
      });
    }, 2000);
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
            <Check className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">🔥 You're in!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We'll feature your profile soon on your school's Instagram!
          </p>
          <div className="bg-card/50 rounded-2xl p-6 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Keep an eye on <span className="font-semibold text-foreground">@{selectedSchool}class</span> for your feature!
            </p>
          </div>
          <Button 
            onClick={handleClose}
            className="mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600"
          >
            Close
          </Button>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your School</h2>
              <p className="text-muted-foreground">Select your university to get featured on their Instagram</p>
              <p className="text-sm text-primary font-medium mt-2">Posting costs $5</p>
            </div>
            <SearchableSelect
              options={SCHOOL_DATABASE}
              value={selectedSchool}
              onValueChange={setSelectedSchool}
              placeholder="Search and select your school..."
              className="h-14 text-lg"
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Instagram Handle</h2>
              <p className="text-muted-foreground">Enter your @username so we can tag you</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">@</span>
              <Input
                placeholder="your_username"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                className="h-14 pl-8 text-lg"
              />
            </div>
            {instagramHandle && (
              <div className="bg-card/50 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  We'll tag you as <span className="font-semibold text-foreground">@{instagramHandle}</span>
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tell Your Story</h2>
              <p className="text-muted-foreground">Share 1-2 lines about yourself</p>
            </div>
            <Textarea
              placeholder="Share your excitement about college, a fun fact about yourself, or what you're looking forward to..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="resize-none text-lg"
              maxLength={150}
            />
            <div className="text-right">
              <span className="text-sm text-muted-foreground">{bio.length}/150</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload Photos</h2>
              <p className="text-muted-foreground">Add 1-10 photos that show your personality</p>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 10 && (
              <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {photos.length === 0 ? "Upload your photos" : "Add more photos"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Max 10 photos • 5MB each • JPG, PNG, GIF
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">School Page Integration</h2>
              <p className="text-muted-foreground">Want your profile shown on your school's FroshMeet page?</p>
            </div>
            
            <Card className="p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="school-page" className="text-base font-medium">
                    Show on School Page
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your profile will appear on the {SCHOOL_DATABASE.find(s => s.value === selectedSchool)?.label} FroshMeet page
                  </p>
                </div>
                <Switch
                  id="school-page"
                  checked={showOnSchoolPage}
                  onCheckedChange={setShowOnSchoolPage}
                />
              </div>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✨ Featured on your school's Instagram story</li>
                <li>📱 Tagged in the post with your @username</li>
                {showOnSchoolPage && <li>🎓 Profile displayed on your school's FroshMeet page</li>}
                <li>🤝 Connect with other students from your school</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Get Featured</h2>
              <p className="text-muted-foreground">Secure your spot for just $5</p>
            </div>

            <Card className="p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-foreground">$5</div>
                <p className="text-muted-foreground">One-time fee to get featured</p>
                
                <div className="bg-background/50 rounded-lg p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School:</span>
                    <span className="text-sm font-medium text-foreground">
                      {SCHOOL_DATABASE.find(s => s.value === selectedSchool)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Instagram:</span>
                    <span className="text-sm font-medium text-foreground">@{instagramHandle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Photos:</span>
                    <span className="text-sm font-medium text-foreground">{photos.length} uploaded</span>
                  </div>
                  {showOnSchoolPage && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">School Page:</span>
                      <span className="text-sm font-medium text-foreground">✓ Included</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Button
              onClick={handlePayment}
              disabled={isSubmitting}
              className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              {isSubmitting ? (
                "Processing Payment..."
              ) : (
                <>
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pay $5 & Get Featured
                </>
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" hideCloseButton>
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Get Featured</h1>
                <p className="text-white/80 text-sm">on your school's Instagram</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          {!isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-white/80 text-sm">{STEPS[currentStep].description}</p>
            </div>
          )}
        </div>

        <div className="p-6">
          {renderStepContent()}

          {/* Navigation */}
          {!isCompleted && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
