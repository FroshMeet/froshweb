import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageSquare, X, Instagram, Phone } from "lucide-react";

const WelcomeScreen = ({ onUserCreate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    college: "",
    major: "",
    year: "Freshman",
    dorm: "",
    bio: "",
    interests: [],
    lookingFor: [],
    instagram: "",
    snapchat: "",
    phoneNumber: ""
  });

  const colleges = [
    "Arizona State University (ASU)",
    "Harvard University",
    "UCLA",
    "Stanford University",
    "University of Michigan",
    "UC Berkeley",
    "MIT",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Texas at Austin",
    "University of Florida",
    "NYU",
    "USC"
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
    if (step < 4) {
      setStep(step + 1);
    } else {
      onUserCreate(formData);
    }
  };

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
            {step === 2 && "Your academic info"}
            {step === 3 && "Tell us about yourself"}
            {step === 4 && "Connect your socials (optional)"}
          </p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4].map((stepNum) => (
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
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="18"
                  min="16"
                  max="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College/University</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, college: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dorm">Dorm/Residence</Label>
                <Input
                  id="dorm"
                  value={formData.dorm}
                  onChange={(e) => setFormData(prev => ({ ...prev, dorm: e.target.value }))}
                  placeholder="e.g., Warren Hall, Off-campus"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-slate-100 text-slate-700">
                      {interest}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addInterest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add interests" />
                  </SelectTrigger>
                  <SelectContent>
                    {interestOptions.map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Looking for</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.lookingFor.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-slate-100 text-slate-700">
                      {item}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeLookingFor(item)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addLookingFor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select what you're looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookingForOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">
                  Add your social media (optional). Only share with people you trust!
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram Username
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snapchat" className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  Snapchat Username
                </Label>
                <Input
                  id="snapchat"
                  value={formData.snapchat}
                  onChange={(e) => setFormData(prev => ({ ...prev, snapchat: e.target.value }))}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Users className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium">Connect with peers</p>
                    <p className="text-sm text-slate-600">Find study buddies and friends</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium">Smart matching</p>
                    <p className="text-sm text-slate-600">Based on classes, dorms & interests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Heart className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium">Safe & secure</p>
                    <p className="text-sm text-slate-600">Privacy controls & verified students</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Button 
            onClick={handleNext}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 transition-colors duration-200"
            disabled={
              (step === 1 && (!formData.name || !formData.age || !formData.college)) ||
              (step === 2 && (!formData.major || !formData.dorm)) ||
              (step === 3 && (!formData.bio || formData.interests.length === 0 || formData.lookingFor.length === 0))
            }
          >
            {step === 4 ? "Get Started" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
