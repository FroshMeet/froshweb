import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import froshLogo from "@/assets/frosh-logo-new.png";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    major: "",
    bio: "",
    class_year: "",
    looking_for_roommate: false,
    interests: [] as string[]
  });
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Pre-fill with existing profile data if available
    if (userProfile) {
      setFormData({
        major: userProfile.major || "",
        bio: userProfile.bio || "",
        class_year: userProfile.class_year || "",
        looking_for_roommate: userProfile.looking_for_roommate || false,
        interests: userProfile.interests || []
      });
    }
  }, [user, userProfile, navigate]);

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await updateProfile(formData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Profile Updated!",
        description: "Your profile has been set up successfully.",
      });
      
      // Navigate to the user's school dashboard
      const schoolSlug = userProfile?.school?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (schoolSlug) {
        navigate(`/${schoolSlug}`);
      } else {
        navigate('/community');
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/signin')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <img 
              src={froshLogo}
              alt="Frosh Logo" 
              className={isMobile ? "h-10 w-auto" : "h-16 w-auto"}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-xl border-border/40 shadow-2xl frosted-card">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-primary animate-pulse">
              Complete Your Profile
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Tell us about yourself to connect with the right people at {userProfile?.school || "your school"}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Major */}
              <div className="space-y-2">
                <Label htmlFor="major" className="text-foreground font-medium">
                  Major/Field of Study
                </Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="e.g., Computer Science, Psychology, Business"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all duration-300"
                />
              </div>

              {/* Graduation Year */}
              <div className="space-y-2">
                <Label htmlFor="class_year" className="text-foreground font-medium">
                  Expected Graduation Year
                </Label>
                <Select value={formData.class_year} onValueChange={(value) => setFormData({ ...formData, class_year: value })}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/60 focus:border-primary">
                    <SelectValue placeholder="Select graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        Class of {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground font-medium">
                  About You
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell people about yourself, your hobbies, what you're looking for..."
                  className="min-h-[100px] bg-background/50 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all duration-300"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-foreground font-medium">Interests & Hobbies</Label>
                
                {/* Add Interest Input */}
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="flex-1 bg-background/50 border-border/60 focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim()}
                    className="neon-glow"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Interest Tags */}
                {formData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => handleRemoveInterest(interest)}
                      >
                        {interest}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Looking for Roommate */}
              <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg border border-border">
                <Checkbox
                  id="roommate"
                  checked={formData.looking_for_roommate}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, looking_for_roommate: !!checked })
                  }
                />
                <Label htmlFor="roommate" className="text-sm font-medium">
                  I'm looking for a roommate
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>

              {/* Skip Option */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/community')}
                className="w-full text-muted-foreground hover:text-primary"
              >
                Skip for now
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;