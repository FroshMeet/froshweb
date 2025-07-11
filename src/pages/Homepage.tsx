
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, Sparkles, ArrowRight, Instagram, Star, Shield, Globe, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-college-students.jpg";

const schools = [
  "Arizona State University",
  "University of California Los Angeles", 
  "University of Southern California",
  "Stanford University",
  "University of California Berkeley",
  "New York University",
  "Columbia University",
  "Harvard University",
  "Yale University",
  "Princeton University"
];

export default function Homepage() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGetFeatured = () => {
    if (selectedSchool) {
      const schoolSlug = selectedSchool.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/${schoolSlug}/guest-post-to-insta`);
    } else {
      navigate('/create-profile');
    }
  };

  const handleJoinNow = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/95 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-primary">FroshMeet</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors story-link">About</a>
              <a href="/features" className="text-muted-foreground hover:text-foreground transition-colors story-link">Features</a>
              <a href="/community" className="text-muted-foreground hover:text-foreground transition-colors story-link">Community</a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors story-link">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
              <Button onClick={handleJoinNow} className="bg-primary hover:bg-primary/90">
                Join FroshMeet Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Welcome to College Life
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                  Find Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
                    College Tribe
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Connect with fellow students, find your perfect roommate, and build lasting friendships that will define your college experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleJoinNow}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                >
                  Join FroshMeet Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <div className="relative">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-lg px-8 py-6 w-full sm:w-auto bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Get Featured
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {showDropdown && (
                    <div className="absolute top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg z-50 animate-scale-in">
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-muted-foreground">Select your school:</p>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {schools.map((school) => (
                            <button
                              key={school}
                              onClick={() => {
                                setSelectedSchool(school);
                                setShowDropdown(false);
                                handleGetFeatured();
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                            >
                              {school}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Safe & Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>50+ Universities</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3"></div>
              <img 
                src="/lovable-uploads/f95a4d92-a40d-46a3-9199-c970d7098828.png"
                alt="College students connecting and making friends" 
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Everything You Need for College Life
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From finding roommates to building your social circle, FroshMeet has all the tools you need to thrive in college.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Meet New People</CardTitle>
                <CardDescription>
                  Connect with students who share your interests, hobbies, and academic goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Find Roommates</CardTitle>
                <CardDescription>
                  Use our smart matching system to find the perfect roommate for your living situation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Group Chats</CardTitle>
                <CardDescription>
                  Join school-specific chat rooms and stay connected with your campus community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Instagram Features</CardTitle>
                <CardDescription>
                  Get featured on your school's official Instagram account and showcase your personality.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Safe & Verified</CardTitle>
                <CardDescription>
                  All profiles are verified with .edu emails to ensure a safe, authentic community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Premium Experience</CardTitle>
                <CardDescription>
                  Enjoy ad-free browsing and exclusive features designed for the modern college student.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
            Ready to Start Your College Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who are already building their college communities on FroshMeet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleJoinNow}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              Join FroshMeet Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/about')}
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/95 backdrop-blur-xl border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-primary">FroshMeet</span>
              </div>
              <p className="text-muted-foreground">
                Connecting college students and building lasting friendships across campuses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="/community" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FroshMeet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
