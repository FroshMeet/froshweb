
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageSquare, X } from "lucide-react";

const WelcomeScreen = ({ onUserCreate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    college: "",
    major: "",
    bio: "",
    interests: [],
    lookingFor: []
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
    if (step < 3) {
      setStep(step + 1);
    } else {
      onUserCreate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to FreshConnect
          </CardTitle>
          <p className="text-muted-foreground">
            {step === 1 && "Let's start with the basics"}
            {step === 2 && "Tell us about yourself"}
            {step === 3 && "What are you looking for?"}
          </p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  stepNum <= step ? "bg-blue-600" : "bg-gray-200"
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
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>
            </>
          )}

          {step === 2 && (
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
                    <Badge key={interest} variant="secondary" className="bg-blue-100 text-blue-700">
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
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>What are you looking for?</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.lookingFor.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-purple-100 text-purple-700">
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
              <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Connect with peers</p>
                    <p className="text-sm text-muted-foreground">Find study buddies and friends</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Join group chats</p>
                    <p className="text-sm text-muted-foreground">Connect based on interests</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Find your perfect roommate</p>
                    <p className="text-sm text-muted-foreground">Compatible living arrangements</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={
              (step === 1 && (!formData.name || !formData.age || !formData.college || !formData.major)) ||
              (step === 2 && (!formData.bio || formData.interests.length === 0)) ||
              (step === 3 && formData.lookingFor.length === 0)
            }
          >
            {step === 3 ? "Get Started" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
