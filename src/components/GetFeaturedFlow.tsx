import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Upload, X, ArrowLeft, ArrowRight, Check, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

// Use the EXACT same school database as homepage
const SCHOOL_DATABASE = [
  { name: "University of California, Los Angeles", acronym: "UCLA", searchTerms: ["ucla", "los angeles", "westwood"], slug: "ucla" },
  { name: "Stanford University", acronym: "Stanford", searchTerms: ["stanford", "palo alto"], slug: "stanford" },
  { name: "University of California, Berkeley", acronym: "UC Berkeley", searchTerms: ["berkeley", "cal", "uc berkeley", "ucb"], slug: "uc-berkeley" },
  { name: "University of Southern California", acronym: "USC", searchTerms: ["usc", "southern california", "trojans"], slug: "usc" },
  { name: "Harvard University", acronym: "Harvard", searchTerms: ["harvard", "cambridge"], slug: "harvard" },
  { name: "Arizona State University", acronym: "ASU", searchTerms: ["asu", "arizona state", "tempe"], slug: "asu" },
  { name: "University of California, Santa Barbara", acronym: "UCSB", searchTerms: ["ucsb", "santa barbara", "uc santa barbara"], slug: "ucsb" },
  { name: "New York University", acronym: "NYU", searchTerms: ["nyu", "new york university", "new york"], slug: "nyu" },
  { name: "University of Florida", acronym: "UF", searchTerms: ["uf", "florida", "gainesville", "gators"], slug: "uf" },
  { name: "Texas A&M University", acronym: "Texas A&M", searchTerms: ["texas a&m", "tamu", "college station"], slug: "texas-aandm" },
  { name: "Cornell University", acronym: "Cornell", searchTerms: ["cornell", "ithaca"], slug: "cornell" },
  { name: "Pennsylvania State University", acronym: "Penn State", searchTerms: ["penn state", "psu", "university park"], slug: "penn-state" },
  { name: "Duke University", acronym: "Duke", searchTerms: ["duke", "durham"], slug: "duke" },
  { name: "Florida State University", acronym: "FSU", searchTerms: ["fsu", "florida state", "tallahassee"], slug: "fsu" },
  { name: "University of Pennsylvania", acronym: "UPenn", searchTerms: ["upenn", "penn", "pennsylvania", "philadelphia"], slug: "upenn" },
  { name: "Dartmouth College", acronym: "Dartmouth", searchTerms: ["dartmouth", "hanover"], slug: "dartmouth" },
  { name: "Columbia University", acronym: "Columbia", searchTerms: ["columbia", "new york"], slug: "columbia" },
  { name: "University of California, Irvine", acronym: "UC Irvine", searchTerms: ["uci", "irvine", "uc irvine"], slug: "uc-irvine" },
  { name: "University of Michigan", acronym: "UMich", searchTerms: ["michigan", "ann arbor", "wolverines", "umich"], slug: "umich" },
  { name: "Massachusetts Institute of Technology", acronym: "MIT", searchTerms: ["mit", "massachusetts institute"], slug: "mit" },
  { name: "Northeastern University", acronym: "Northeastern", searchTerms: ["northeastern", "boston"], slug: "northeastern" },
  { name: "University of California, San Diego", acronym: "UCSD", searchTerms: ["ucsd", "san diego", "uc san diego"], slug: "ucsd" },
  { name: "University of Central Florida", acronym: "UCF", searchTerms: ["ucf", "central florida", "orlando"], slug: "ucf" },
  { name: "Princeton University", acronym: "Princeton", searchTerms: ["princeton", "tigers"], slug: "princeton" },
  { name: "Brown University", acronym: "Brown", searchTerms: ["brown", "providence"], slug: "brown" },
  { name: "Yale University", acronym: "Yale", searchTerms: ["yale", "new haven"], slug: "yale" },
  { name: "Georgetown University", acronym: "Georgetown", searchTerms: ["georgetown", "washington dc"], slug: "georgetown" },
  { name: "University of California, Santa Cruz", acronym: "UC Santa Cruz", searchTerms: ["ucsc", "santa cruz", "uc santa cruz"], slug: "uc-santa-cruz" },
  { name: "Carnegie Mellon University", acronym: "CMU", searchTerms: ["cmu", "carnegie mellon", "pittsburgh"], slug: "cmu" },
  { name: "University of Miami", acronym: "UMiami", searchTerms: ["miami", "coral gables"], slug: "umiami" },
  { name: "Northwestern University", acronym: "Northwestern", searchTerms: ["northwestern", "evanston"], slug: "northwestern" },
  { name: "Rice University", acronym: "Rice", searchTerms: ["rice", "houston"], slug: "rice" },
  { name: "Purdue University", acronym: "Purdue", searchTerms: ["purdue", "west lafayette"], slug: "purdue" },
  { name: "University of Chicago", acronym: "UChicago", searchTerms: ["uchicago", "university of chicago", "chicago"], slug: "uchicago" },
  { name: "Vanderbilt University", acronym: "Vanderbilt", searchTerms: ["vanderbilt", "nashville"], slug: "vanderbilt" },
  { name: "Indiana University Bloomington", acronym: "IU Bloomington", searchTerms: ["iu", "indiana university", "bloomington"], slug: "iu-bloomington" },
  { name: "University of Georgia", acronym: "UGA", searchTerms: ["uga", "georgia", "athens"], slug: "uga" },
  { name: "University of Illinois Urbana-Champaign", acronym: "UIUC", searchTerms: ["uiuc", "illinois", "urbana champaign"], slug: "uiuc" },
  { name: "Ohio State University", acronym: "Ohio State", searchTerms: ["osu", "ohio state", "columbus"], slug: "ohio-state" },
  { name: "Michigan State University", acronym: "Michigan State", searchTerms: ["msu", "michigan state", "east lansing"], slug: "michigan-state" },
  { name: "University of Minnesota", acronym: "UMN", searchTerms: ["minnesota", "twin cities", "gophers"], slug: "umn" },
  { name: "University of North Carolina at Chapel Hill", acronym: "UNC Chapel Hill", searchTerms: ["unc", "chapel hill", "north carolina"], slug: "unc" },
  { name: "University of Oregon", acronym: "UOregon", searchTerms: ["oregon", "eugene", "ducks"], slug: "uoregon" },
  { name: "University of Texas at Austin", acronym: "UT Austin", searchTerms: ["ut", "texas", "austin", "longhorns"], slug: "ut-austin" },
  { name: "University of Virginia", acronym: "UVA", searchTerms: ["uva", "virginia", "charlottesville"], slug: "uva" },
  { name: "University of Washington", acronym: "UW", searchTerms: ["uw", "washington", "seattle", "huskies"], slug: "uw" },
  { name: "University of Wisconsin–Madison", acronym: "UW-Madison", searchTerms: ["wisconsin", "madison", "badgers"], slug: "uw-madison" },
  { name: "California Polytechnic State University, San Luis Obispo", acronym: "Cal Poly SLO", searchTerms: ["cal poly", "slo", "san luis obispo", "cal poly slo"], slug: "cal-poly-slo" },
  { name: "California State Polytechnic University, Pomona", acronym: "Cal Poly Pomona", searchTerms: ["cal poly pomona", "cpp", "pomona"], slug: "cal-poly-pomona" },
  { name: "University of California, Davis", acronym: "UC Davis", searchTerms: ["ucd", "davis", "uc davis"], slug: "uc-davis" },
  { name: "University of California, Riverside", acronym: "UC Riverside", searchTerms: ["ucr", "riverside", "uc riverside"], slug: "uc-riverside" },
  { name: "University of California, Merced", acronym: "UC Merced", searchTerms: ["ucm", "merced", "uc merced"], slug: "uc-merced" },
  { name: "California Institute of Technology", acronym: "Caltech", searchTerms: ["caltech", "pasadena", "california institute of technology"], slug: "caltech" },
  { name: "California State University, Sacramento", acronym: "Sac State", searchTerms: ["sac state", "sacramento state", "csus"], slug: "sac-state" },
  { name: "San Diego State University", acronym: "SDSU", searchTerms: ["sdsu", "san diego state"], slug: "sdsu" },
  { name: "San Jose State University", acronym: "SJSU", searchTerms: ["sjsu", "san jose state"], slug: "sjsu" },
  { name: "San Francisco State University", acronym: "SF State", searchTerms: ["sf state", "san francisco state", "sfsu"], slug: "sf-state" },
  { name: "California State University, Chico", acronym: "Chico State", searchTerms: ["chico", "chico state", "csu chico"], slug: "chico-state" },
  { name: "Boston University", acronym: "BU", searchTerms: ["bu", "boston university", "boston"], slug: "bu" },
  { name: "University of Arizona", acronym: "UArizona", searchTerms: ["arizona", "tucson"], slug: "uarizona" },
  { name: "University of Alabama", acronym: "UA", searchTerms: ["alabama", "tuscaloosa", "roll tide"], slug: "ua" },
  { name: "University of Colorado Boulder", acronym: "CU Boulder", searchTerms: ["cu boulder", "colorado boulder", "boulder"], slug: "cu-boulder" },
  { name: "California State University, Long Beach", acronym: "CSULB", searchTerms: ["csulb", "long beach", "cal state long beach"], slug: "csulb" },
  { name: "Virginia Polytechnic Institute and State University", acronym: "Virginia Tech", searchTerms: ["virginia tech", "vt", "blacksburg"], slug: "virginia-tech" }
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [showOnSchoolPage, setShowOnSchoolPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  // Copy exact search function from homepage
  const searchSchools = (query: string) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    // First pass: Exact matches (highest priority)
    for (const school of SCHOOL_DATABASE) {
      for (const keyword of school.searchTerms) {
        if (keyword.toLowerCase() === searchTerm) {
          results.push({ school, score: 100, matchType: 'exact' });
          break;
        }
      }
    }
    
    // Second pass: Starts with matches
    if (results.length < 10) {
      for (const school of SCHOOL_DATABASE) {
        // Skip if already found in exact matches
        if (results.some(r => r.school.name === school.name)) continue;
        
        for (const keyword of school.searchTerms) {
          if (keyword.toLowerCase().startsWith(searchTerm)) {
            results.push({ school, score: 75, matchType: 'startsWith' });
            break;
          }
        }
      }
    }
    
    // Third pass: Contains matches (lowest priority)
    if (results.length < 10) {
      for (const school of SCHOOL_DATABASE) {
        // Skip if already found
        if (results.some(r => r.school.name === school.name)) continue;
        
        for (const keyword of school.searchTerms) {
          if (keyword.toLowerCase().includes(searchTerm)) {
            results.push({ school, score: 50, matchType: 'contains' });
            break;
          }
        }
      }
    }
    
    // Sort by score (highest first) and return top 10
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => r.school);
  };

  const filteredSchools = searchSchools(searchTerm);

  const handleSchoolSelect = (schoolSlug: string) => {
    setSelectedSchool(schoolSlug);
    setSearchTerm("");
    nextStep(); // Automatically advance to next step
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedSchool(preSelectedSchool || "");
    setSearchTerm("");
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
    
    try {
      const { data, error } = await supabase.functions.invoke('create-guest-payment', {
        body: { school: selectedSchool }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            
            {selectedSchool && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">
                    {SCHOOL_DATABASE.find(s => s.slug === selectedSchool)?.name}
                  </span>
                </div>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search schools, cities, or acronyms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 pl-10 text-lg bg-card/50 border-border/40"
              />
              {searchTerm && filteredSchools.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-[9999] shadow-2xl animate-fade-scale-in">
                  {filteredSchools.slice(0, 5).map((school) => (
                    <div
                      key={school.slug}
                      className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/40 last:border-b-0 transition-colors"
                      onClick={() => handleSchoolSelect(school.slug)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-primary">{school.acronym}</div>
                        <div className="text-sm text-foreground">{school.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Bio</h2>
            </div>
            <Textarea
              placeholder="Share your excitement about college, a fun fact about yourself, or what you're looking forward to..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="resize-none text-lg"
              maxLength={100}
            />
            <div className="text-right">
              <span className="text-sm text-muted-foreground">{bio.length}/100</span>
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
                    Your profile will appear on the {SCHOOL_DATABASE.find(s => s.slug === selectedSchool)?.name} FroshMeet page
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
                      {SCHOOL_DATABASE.find(s => s.slug === selectedSchool)?.name}
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
