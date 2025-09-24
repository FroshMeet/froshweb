import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartSchoolSearch } from "@/components/SmartSchoolSearch";
import { School, schools } from "@/data/schools";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Instagram } from "lucide-react";
import freshMeatIcon from "@/assets/fresh-meat-app-icon.png";

export default function AppLanding() {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    email: "",
    phone: ""
  });
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [signupCount, setSignupCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (selectedSchool) {
      fetchSignupCount(selectedSchool.name);
    }
  }, [selectedSchool]);

  const fetchSignupCount = async (schoolName: string) => {
    try {
      const { data, error } = await supabase.rpc('get_school_signup_count', {
        school_name: schoolName
      });
      
      if (error) throw error;
      setSignupCount(data || 0);
    } catch (error) {
      console.error('Error fetching signup count:', error);
    }
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setFormData(prev => ({ ...prev, school: school.name }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.school.trim()) {
      toast({ title: "School selection is required", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast({ title: "Email or phone number is required", variant: "destructive" });
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({
          name: formData.name.trim(),
          school: formData.school.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        });

      if (error) throw error;

      setIsSubmitted(true);
      // Refresh signup count
      if (selectedSchool) {
        fetchSignupCount(selectedSchool.name);
      }
    } catch (error: any) {
      console.error('Error submitting signup:', error);
      toast({ 
        title: "Signup failed", 
        description: error.message || "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubtext = () => {
    if (!selectedSchool) return "Pre-Sign Up Today to Be First In. Meet people before day one.";
    if (signupCount < 10) {
      return `Pre-Sign Up Today to Be First In. Meet people at ${selectedSchool.name} before day one.`;
    }
    return `Join the waitlist → ${signupCount} students already signed up at ${selectedSchool.name}.`;
  };

  const getProgressMessage = () => {
    if (!selectedSchool || signupCount === 0) return null;
    if (signupCount < 10) {
      return `${signupCount}/10 students signed up at ${selectedSchool.shortName || selectedSchool.name} → Unlock group chat early!`;
    }
    return null;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card">
              <Card className="glass-content bg-card/50 border-border/40 p-12">
                <div className="mb-8">
                  <img 
                    src={freshMeatIcon} 
                    alt="Fresh Meat App" 
                    className="w-24 h-24 mx-auto mb-6 select-none"
                  />
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-6">
                  🎉 You're on the list!
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Be the first to claim your profile when we launch.
                </p>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white hover:from-pink-600 hover:to-purple-600 select-none"
                  onClick={() => window.open('https://instagram.com/freshmeatapp', '_blank')}
                >
                  <Instagram className="h-5 w-5 mr-2 select-none" />
                  Follow @freshmeatapp
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                📱 FreshMeat App launching February 15th.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {getSubtext()}
              </p>
              
              {getProgressMessage() && (
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-primary font-medium">
                    {getProgressMessage()}
                  </p>
                </div>
              )}

              {/* Signup Form */}
              <div className="glass-card">
                <Card className="glass-content bg-card/50 border-border/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label>School</Label>
                        <div className="mt-1">
                          <SmartSchoolSearch
                            onSelect={handleSchoolSelect}
                            placeholder="Search for your school..."
                            selectedSchool={selectedSchool}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Email OR phone number required
                      </p>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-lg select-none"
                      >
                        {isSubmitting ? "Joining..." : "Join Waitlist"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - App Mockup */}
            <div className="flex flex-col items-center space-y-8">
              <div className="glass-card">
                <div className="glass-content p-8 text-center">
                  <img 
                    src={freshMeatIcon} 
                    alt="Fresh Meat App" 
                    className="w-32 h-32 mx-auto mb-6 select-none"
                  />
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    The ultimate way to connect with your classmates before day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}