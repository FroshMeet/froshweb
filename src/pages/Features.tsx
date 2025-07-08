import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Calendar, Shield, Search, Heart, Zap, Star } from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                alt="FroshMeet Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Button variant="ghost" onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground">
                  Community
                </Button>
                <Button variant="ghost" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">
                  About
                </Button>
                <Button variant="ghost" onClick={() => navigate('/features')} className="text-foreground">
                  Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground">
                  Contact
                </Button>
              </div>
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/community')} className="bg-primary hover:bg-primary/90">
                Join FroshMeet Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              How It Works
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                connect & thrive
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover all the powerful features that make FroshMeet the perfect platform 
              for college freshmen to build meaningful connections before day one.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Smart Matching</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our intelligent algorithm connects you with compatible roommates, study partners, and friends based on your interests, major, and lifestyle preferences.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Personality-based matching</li>
                    <li>• Academic compatibility</li>
                    <li>• Lifestyle preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-green-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <MessageSquare className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Secure Messaging</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Chat safely with verified students through our moderated messaging system. Share contact info only when you're ready.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• End-to-end encryption</li>
                    <li>• Moderated conversations</li>
                    <li>• Privacy controls</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Student Verification</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Every user is verified through their official university email and student ID, ensuring a safe and authentic community.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• University email verification</li>
                    <li>• Student ID confirmation</li>
                    <li>• 24/7 moderation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-orange-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Event Discovery</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Find and join study groups, social events, and campus activities. Create your own events and invite new friends.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Campus event calendar</li>
                    <li>• Study group formation</li>
                    <li>• Custom event creation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-pink-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <Search className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Advanced Filtering</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Filter potential connections by major, interests, dorm preferences, study habits, and more to find your perfect match.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Major and minor filtering</li>
                    <li>• Interest-based search</li>
                    <li>• Location preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-red-600/40 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Profile Customization</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Create a comprehensive profile that showcases your personality, interests, and what you're looking for in college.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Photo galleries</li>
                    <li>• Interest tags</li>
                    <li>• Goal setting</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How FroshMeet Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started in three simple steps and find your college community
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Create Your Profile</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sign up with your university email, verify your student status, and create a detailed profile showcasing your interests and goals.
                </p>
              </div>
              
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Discover Connections</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse through verified students from your school, use our smart matching system, and find people who share your interests.
                </p>
              </div>
              
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Start Connecting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send messages, join study groups, attend events, and build meaningful relationships before you even arrive on campus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 animate-fade-in">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to experience all these features?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already using FroshMeet to build their college community
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/community')}
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              © 2025 FroshMeet. All rights reserved. FroshMeet is a registered trademark of FroshMeet LLC. 
              FroshMeet is not officially partnered with any university.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;