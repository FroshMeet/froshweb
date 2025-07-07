import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import OnboardingStep1 from "./onboarding/OnboardingStep1";
import OnboardingStep2 from "./onboarding/OnboardingStep2";
import OnboardingStep3 from "./onboarding/OnboardingStep3";
import OnboardingStep4 from "./onboarding/OnboardingStep4";
import PhoneVerification from "./onboarding/PhoneVerification";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const WelcomeScreen = ({ onUserCreate, onGuestContinue }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuestSchoolSelection, setShowGuestSchoolSelection] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [guestSchoolSearch, setGuestSchoolSearch] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    college: "",
    phoneNumber: "",
    major: "",
    classOf: "2029",
    dorm: "",
    bio: "",
    interests: [],
    lookingFor: [],
    instagram: "",
    snapchat: "",
    instagramPublic: false,
    snapchatPublic: false,
    verificationCode: ""
  });

  const colleges = [
    "Arizona State University",
    "Boston University", 
    "Brown University",
    "Caltech",
    "Carnegie Mellon University",
    "Columbia University",
    "Dartmouth College",
    "Duke University",
    "Emory University",
    "Florida State University",
    "Georgetown University",
    "Harvard University",
    "Indiana University Bloomington",
    "Massachusetts Institute of Technology (MIT)",
    "Michigan State University",
    "Northwestern University",
    "New York University (NYU)",
    "Ohio State University",
    "Penn State",
    "Princeton University",
    "Purdue University",
    "Rice University",
    "Stanford University",
    "Texas A&M University",
    "UC Berkeley",
    "UC Davis",
    "UC Irvine",
    "UC Merced",
    "UC Santa Barbara",
    "UC Santa Cruz",
    "UC San Diego (UCSD)",
    "UC Los Angeles (UCLA)",
    "University of Alabama",
    "University of Arizona",
    "University of Chicago",
    "University of Florida",
    "University of Georgia",
    "University of Michigan",
    "University of Minnesota",
    "University of North Carolina at Chapel Hill (UNC Chapel Hill)",
    "University of Oregon",
    "University of Pennsylvania (UPenn)",
    "University of South Carolina",
    "University of Texas",
    "University of Virginia",
    "University of Washington",
    "University of Southern California (USC)",
    "Vanderbilt University",
    "Virginia Tech",
    "Yale University"
  ];

  const interestOptions = [
    "Programming", "Sports", "Music", "Art", "Photography", "Reading",
    "Gaming", "Hiking", "Cooking", "Travel", "Dancing", "Fitness",
    "Movies", "Anime", "Fashion", "Volunteering", "Business", "Science"
  ];

  const lookingForOptions = [
    "Friends", "Study Buddy", "Roommate", "Dating", "Networking", "Activity Partner"
  ];

  const addInterest = (interest) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addLookingFor = (item) => {
    if (!formData.lookingFor.includes(item)) {
      setFormData(prev => ({
        ...prev,
        lookingFor: [...prev.lookingFor, item]
      }));
    }
  };

  const removeLookingFor = (item) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.filter(i => i !== item)
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onUserCreate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const filteredCollegesForGuest = colleges.filter(college =>
    college.toLowerCase().includes(guestSchoolSearch.toLowerCase())
  );

  const handleGuestSchoolSelect = () => {
    if (selectedSchool) {
      onGuestContinue(selectedSchool);
    }
  };

  if (showGuestSchoolSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">
              Choose Your School
            </CardTitle>
            <p className="text-slate-600 font-medium">
              Select which school you'd like to explore
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Select onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-white z-50">
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search schools..."
                        value={guestSchoolSearch}
                        onChange={(e) => setGuestSchoolSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[250px]">
                    {filteredCollegesForGuest.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowGuestSchoolSelection(false)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleGuestSchoolSelect}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 transition-colors duration-200"
                disabled={!selectedSchool}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">
              FroshMeet
            </CardTitle>
            <p className="text-slate-600 font-medium">
              Connect with your college classmates
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-colors duration-200"
            >
              Create Account
            </Button>
            <Button 
              onClick={() => setShowGuestSchoolSelection(true)}
              variant="outline"
              className="w-full border-border text-muted-foreground hover:bg-muted hover:text-foreground font-semibold py-3 transition-colors duration-200"
            >
              Continue as Guest
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Create an account to message classmates and build your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-800">
            FroshMeet
          </CardTitle>
          <p className="text-slate-600 font-medium">
            {step === 1 && "Let's start with the basics"}
            {step === 2 && "Verify your phone number"}
            {step === 3 && "Your academic info"}
            {step === 4 && "Tell us about yourself"}
            {step === 5 && "Connect your socials (optional)"}
          </p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  stepNum <= step ? "bg-slate-800 scale-110" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <OnboardingStep1 
              formData={formData}
              setFormData={setFormData}
              colleges={colleges}
            />
          )}

          {step === 2 && (
            <PhoneVerification 
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 3 && (
            <OnboardingStep2 
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 4 && (
            <OnboardingStep3 
              formData={formData}
              setFormData={setFormData}
              interestOptions={interestOptions}
              lookingForOptions={lookingForOptions}
              addInterest={addInterest}
              removeInterest={removeInterest}
              addLookingFor={addLookingFor}
              removeLookingFor={removeLookingFor}
            />
          )}

          {step === 5 && (
            <OnboardingStep4 
              formData={formData}
              setFormData={setFormData}
            />
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-colors duration-200"
              disabled={
                (step === 1 && (!formData.name || !formData.age || !formData.college || !formData.phoneNumber)) ||
                (step === 2 && !formData.verificationCode) ||
                (step === 3 && (!formData.major || !formData.dorm)) ||
                (step === 4 && (!formData.bio || formData.interests.length === 0 || formData.lookingFor.length === 0))
              }
            >
              {step === 5 ? "Get Started" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
