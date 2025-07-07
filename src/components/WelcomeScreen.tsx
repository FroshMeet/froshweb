import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, ArrowRight, Zap, GraduationCap, User, Heart, Camera, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const WelcomeScreen = ({ onUserCreate, onGuestContinue }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showGuestSchoolSelection, setShowGuestSchoolSelection] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [guestSchoolSearch, setGuestSchoolSearch] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    verificationCode: "",
    graduationYear: "2029",
    major: "",
    bio: "",
    interests: [],
    photo: null,
    college: null
  });

  // Official college list - alphabetized and formatted
  const colleges = [
    { name: "Arizona State University", acronym: "ASU", searchTerms: ["asu", "arizona state", "tempe"] },
    { name: "Boston University", acronym: "BU", searchTerms: ["bu", "boston university", "boston"] },
    { name: "Brown University", acronym: "Brown", searchTerms: ["brown", "providence"] },
    { name: "Cal Poly Pomona", acronym: "CPP", searchTerms: ["cal poly pomona", "cpp", "pomona"] },
    { name: "California Polytechnic State University, San Luis Obispo", acronym: "Cal Poly SLO", searchTerms: ["cal poly", "slo", "san luis obispo", "cal poly slo"] },
    { name: "California Institute of Technology (Caltech)", acronym: "Caltech", searchTerms: ["caltech", "pasadena", "california institute of technology"] },
    { name: "California State University, Long Beach (CSULB)", acronym: "CSULB", searchTerms: ["csulb", "long beach", "cal state long beach"] },
    { name: "Carnegie Mellon University", acronym: "CMU", searchTerms: ["cmu", "carnegie mellon", "pittsburgh"] },
    { name: "Chico State (California State University, Chico)", acronym: "Chico State", searchTerms: ["chico", "chico state", "csu chico"] },
    { name: "Columbia University", acronym: "Columbia", searchTerms: ["columbia", "new york"] },
    { name: "Cornell University", acronym: "Cornell", searchTerms: ["cornell", "ithaca"] },
    { name: "Dartmouth College", acronym: "Dartmouth", searchTerms: ["dartmouth", "hanover"] },
    { name: "Duke University", acronym: "Duke", searchTerms: ["duke", "durham"] },
    { name: "Florida State University", acronym: "FSU", searchTerms: ["fsu", "florida state", "tallahassee"] },
    { name: "Georgetown University", acronym: "Georgetown", searchTerms: ["georgetown", "washington dc"] },
    { name: "Harvard University", acronym: "Harvard", searchTerms: ["harvard", "cambridge"] },
    { name: "Indiana University Bloomington", acronym: "IU", searchTerms: ["iu", "indiana university", "bloomington"] },
    { name: "Massachusetts Institute of Technology (MIT)", acronym: "MIT", searchTerms: ["mit", "massachusetts institute"] },
    { name: "Michigan State University", acronym: "MSU", searchTerms: ["msu", "michigan state", "east lansing"] },
    { name: "Northeastern University", acronym: "Northeastern", searchTerms: ["northeastern", "boston"] },
    { name: "Northwestern University", acronym: "Northwestern", searchTerms: ["northwestern", "evanston"] },
    { name: "New York University (NYU)", acronym: "NYU", searchTerms: ["nyu", "new york university", "new york"] },
    { name: "Ohio State University", acronym: "OSU", searchTerms: ["osu", "ohio state", "columbus"] },
    { name: "Penn State University (The Pennsylvania State University)", acronym: "Penn State", searchTerms: ["penn state", "psu", "university park"] },
    { name: "Princeton University", acronym: "Princeton", searchTerms: ["princeton", "tigers"] },
    { name: "Purdue University", acronym: "Purdue", searchTerms: ["purdue", "west lafayette"] },
    { name: "Rice University", acronym: "Rice", searchTerms: ["rice", "houston"] },
    { name: "Sacramento State University (Sac State)", acronym: "Sac State", searchTerms: ["sac state", "sacramento state", "csus"] },
    { name: "San Francisco State University (SF State)", acronym: "SF State", searchTerms: ["sf state", "san francisco state", "sfsu"] },
    { name: "San Diego State University (SDSU)", acronym: "SDSU", searchTerms: ["sdsu", "san diego state"] },
    { name: "San Jose State University (SJSU)", acronym: "SJSU", searchTerms: ["sjsu", "san jose state"] },
    { name: "Stanford University", acronym: "Stanford", searchTerms: ["stanford", "palo alto"] },
    { name: "Texas A&M University", acronym: "Texas A&M", searchTerms: ["texas a&m", "tamu", "college station"] },
    { name: "University of Alabama", acronym: "Alabama", searchTerms: ["alabama", "tuscaloosa", "roll tide"] },
    { name: "University of Arizona", acronym: "Arizona", searchTerms: ["arizona", "tucson"] },
    { name: "University of California, Berkeley", acronym: "UC Berkeley", searchTerms: ["berkeley", "cal", "uc berkeley", "ucb"] },
    { name: "University of California, Davis", acronym: "UC Davis", searchTerms: ["ucd", "davis", "uc davis"] },
    { name: "University of California, Irvine", acronym: "UC Irvine", searchTerms: ["uci", "irvine", "uc irvine"] },
    { name: "University of California, Los Angeles", acronym: "UCLA", searchTerms: ["ucla", "los angeles", "westwood"] },
    { name: "University of California, Merced", acronym: "UC Merced", searchTerms: ["ucm", "merced", "uc merced"] },
    { name: "University of California, Riverside", acronym: "UC Riverside", searchTerms: ["ucr", "riverside", "uc riverside"] },
    { name: "University of California, San Diego", acronym: "UC San Diego", searchTerms: ["ucsd", "san diego", "uc san diego"] },
    { name: "University of California, Santa Barbara", acronym: "UC Santa Barbara", searchTerms: ["ucsb", "santa barbara", "uc santa barbara"] },
    { name: "University of California, Santa Cruz", acronym: "UC Santa Cruz", searchTerms: ["ucsc", "santa cruz", "uc santa cruz"] },
    { name: "University of Central Florida (UCF)", acronym: "UCF", searchTerms: ["ucf", "central florida", "orlando"] },
    { name: "University of Chicago", acronym: "UChicago", searchTerms: ["uchicago", "university of chicago", "chicago"] },
    { name: "University of Colorado Boulder", acronym: "CU Boulder", searchTerms: ["cu boulder", "colorado boulder", "boulder"] },
    { name: "University of Florida", acronym: "UF", searchTerms: ["uf", "florida", "gainesville", "gators"] },
    { name: "University of Georgia", acronym: "UGA", searchTerms: ["uga", "georgia", "athens"] },
    { name: "University of Illinois Urbana-Champaign", acronym: "UIUC", searchTerms: ["uiuc", "illinois", "urbana champaign"] },
    { name: "University of Miami", acronym: "Miami", searchTerms: ["miami", "coral gables"] },
    { name: "University of Michigan", acronym: "Michigan", searchTerms: ["michigan", "ann arbor", "wolverines", "umich"] },
    { name: "University of Minnesota", acronym: "Minnesota", searchTerms: ["minnesota", "twin cities", "gophers"] },
    { name: "University of North Carolina at Chapel Hill (UNC Chapel Hill)", acronym: "UNC", searchTerms: ["unc", "chapel hill", "north carolina"] },
    { name: "University of Oregon", acronym: "Oregon", searchTerms: ["oregon", "eugene", "ducks"] },
    { name: "University of Pennsylvania (UPenn)", acronym: "UPenn", searchTerms: ["upenn", "penn", "pennsylvania", "philadelphia"] },
    { name: "University of Southern California (USC)", acronym: "USC", searchTerms: ["usc", "southern california", "trojans"] },
    { name: "University of Texas at Austin", acronym: "UT Austin", searchTerms: ["ut", "texas", "austin", "longhorns"] },
    { name: "University of Virginia", acronym: "UVA", searchTerms: ["uva", "virginia", "charlottesville"] },
    { name: "University of Washington", acronym: "UW", searchTerms: ["uw", "washington", "seattle", "huskies"] },
    { name: "University of Wisconsin–Madison", acronym: "Wisconsin", searchTerms: ["wisconsin", "madison", "badgers"] },
    { name: "Vanderbilt University", acronym: "Vanderbilt", searchTerms: ["vanderbilt", "nashville"] },
    { name: "Virginia Tech", acronym: "VT", searchTerms: ["virginia tech", "vt", "blacksburg"] },
    { name: "Yale University", acronym: "Yale", searchTerms: ["yale", "new haven"] }
  ];

  const graduationYears = ["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];

  const interestTags = [
    "Anime", "Sports", "Music", "Art", "Photography", "Gaming", "Fitness", 
    "Cooking", "Travel", "Reading", "Movies", "Dancing", "Tech", "Business",
    "Pre-med", "Engineering", "Late-night food runs", "Coffee", "Study groups",
    "Outdoor adventures", "Social media", "Fashion", "Volunteering"
  ];

  const searchColleges = (query) => {
    if (!query) return colleges;
    const lowerQuery = query.toLowerCase();
    return colleges.filter(college => 
      college.name.toLowerCase().includes(lowerQuery) ||
      college.acronym.toLowerCase().includes(lowerQuery) ||
      college.searchTerms.some(term => term.includes(lowerQuery))
    );
  };

  const filteredColleges = searchColleges(guestSchoolSearch);
  const filteredCollegesForSignup = searchColleges(formData.email.split('@')[0]);

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete signup
      const userData = {
        ...formData,
        id: Date.now(),
        age: 18,
        college: formData.college?.name || "",
        classOf: formData.graduationYear,
        photos: formData.photo ? [formData.photo] : [],
        lookingFor: ["Friends", "Study Buddy"],
        location: null,
        instagram: "",
        snapchat: "",
        phoneNumber: "",
        instagramPublic: false,
        snapchatPublic: false,
        phonePublic: false,
        isInMeet: false,
        isInDiscover: false,
        dorm: ""
      };
      onUserCreate(userData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setShowSignup(false);
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Choose Your School";
      case 2: return "Email Verification";
      case 3: return "Basic Info";
      case 4: return "Profile Setup";
      case 5: return "You're In! 🎉";
      default: return "";
    }
  };

  // Guest School Selection Flow
  if (showGuestSchoolSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-2xl border border-border/50 bg-card/90 backdrop-blur-xl neon-glow relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-cyan/30 to-neon-violet/30 rounded-3xl mx-auto mb-6 flex items-center justify-center neon-glow-strong">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground capital-a-glow">
              Choose Your School
            </CardTitle>
            <p className="text-muted-foreground font-medium">
              Select which school you'd like to explore
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Select onValueChange={setSelectedSchool}>
                <SelectTrigger className="h-14 text-lg border-border bg-input neon-glow">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] bg-popover border-border text-popover-foreground z-50">
                  <div className="sticky top-0 bg-popover p-3 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search schools, cities, or acronyms..."
                        value={guestSchoolSearch}
                        onChange={(e) => setGuestSchoolSearch(e.target.value)}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[300px]">
                    {filteredColleges.map((college) => (
                      <SelectItem key={college.name} value={college.name} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-bold text-primary">{college.acronym}</div>
                          <div className="text-sm">{college.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowGuestSchoolSelection(false)}
                variant="outline"
                className="flex-1 h-12 border-border"
              >
                Back
              </Button>
              <Button 
                onClick={() => onGuestContinue(selectedSchool)}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 neon-glow font-semibold"
                disabled={!selectedSchool}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Welcome Screen
  if (!showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
          <div className="absolute w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute w-64 h-64 bg-primary/10 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <Card className="w-full max-w-md mx-auto shadow-2xl border border-border/50 bg-card/90 backdrop-blur-xl neon-glow relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-neon-cyan/30 to-neon-violet/30 rounded-3xl mx-auto mb-6 flex items-center justify-center neon-glow-strong">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold text-foreground capital-a-glow mb-2">
              FroshMeet
            </CardTitle>
            <p className="text-muted-foreground font-medium text-lg">
              Connect with your college classmates
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button 
              onClick={() => setShowSignup(true)}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg neon-glow-strong transition-all duration-300"
            >
              Create Account
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowGuestSchoolSelection(true)}
              variant="outline"
              className="w-full h-14 border-border text-foreground hover:bg-muted font-semibold text-lg transition-all duration-300"
            >
              Continue as Guest
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
              Create an account to message classmates and build your profile
            </p>
            
            <p className="text-xs text-muted-foreground/60 text-center border-t border-border pt-4">
              FroshMeet is not affiliated with or endorsed by any university. By signing up, you agree to our Terms and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Signup Flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-2xl border border-border/50 bg-card/90 backdrop-blur-xl neon-glow relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan/30 to-neon-violet/30 rounded-2xl mx-auto mb-4 flex items-center justify-center neon-glow">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground capital-a-glow">
            {getStepTitle()}
          </CardTitle>
          <p className="text-muted-foreground font-medium">
            Step {step} of 5
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  stepNum <= step 
                    ? "bg-primary scale-125 neon-glow" 
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Choose School */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <Select onValueChange={(value) => {
                const college = colleges.find(c => c.name === value);
                setFormData(prev => ({ ...prev, college }));
              }}>
                <SelectTrigger className="h-14 text-lg border-border bg-input neon-glow">
                  <SelectValue placeholder="Search and select your school" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] bg-popover border-border text-popover-foreground z-50">
                  <ScrollArea className="h-[300px]">
                    {colleges.map((college) => (
                      <SelectItem key={college.name} value={college.name} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-bold text-primary">{college.acronym}</div>
                          <div className="text-sm">{college.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your .edu email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-14 text-lg border-border bg-input neon-glow"
                />
              </div>
              
              {formData.email.includes('@') && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email:</p>
                  <Input
                    placeholder="123456"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                    className="h-14 text-lg text-center tracking-widest border-border bg-input neon-glow"
                    maxLength={6}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Basic Info */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <Input
                placeholder="First Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-14 text-lg border-border bg-input neon-glow"
              />
              
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, graduationYear: value }))}>
                <SelectTrigger className="h-14 text-lg border-border bg-input neon-glow">
                  <SelectValue placeholder="Graduation Year" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  {graduationYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Major / Intended Major (optional)"
                value={formData.major}
                onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                className="h-14 text-lg border-border bg-input neon-glow"
              />
            </div>
          )}

          {/* Step 4: Profile Setup */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center neon-glow cursor-pointer hover:scale-105 transition-transform">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <Textarea
                placeholder="Tell us something fun about you (e.g., I once met Drake at In-N-Out...)"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px] text-base border-border bg-input neon-glow resize-none"
              />
              
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Select your interests (at least 3):</p>
                <div className="flex flex-wrap gap-2">
                  {interestTags.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.interests.includes(interest) 
                          ? "bg-primary text-primary-foreground neon-glow" 
                          : "border-border hover:border-primary hover:text-primary"
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400/30 to-green-500/30 rounded-full mx-auto flex items-center justify-center neon-glow-strong">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">You're officially part of FroshMeet!</h3>
                <p className="text-muted-foreground">Let's meet your people.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex space-x-3 pt-6">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12 border-border"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 neon-glow font-semibold"
              disabled={
                (step === 1 && !formData.college) ||
                (step === 2 && (!formData.email.includes('.edu') || formData.verificationCode.length !== 6)) ||
                (step === 3 && !formData.name) ||
                (step === 4 && (formData.interests.length < 3 || !formData.bio))
              }
            >
              {step === 5 ? "Explore Your Campus Feed" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;