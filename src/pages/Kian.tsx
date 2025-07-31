import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const Kian = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <img src={isMobile ? "/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png" : "/lovable-uploads/e9020b20-5a8d-4a80-a4e0-9d917c7c5e5c.png"} alt="FroshMeet Logo" className={isMobile ? "h-10 w-auto" : "h-16 w-auto"} />
            </div>
            
            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Button variant="ghost" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground">
                  Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground">
                  Community
                </Button>
                <Button variant="ghost" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground">
                  Contact
                </Button>
                <Button variant="ghost" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">
                  About
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

      {/* Back Button */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate('/about')} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to About</span>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">CEO</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">kian</span>
            </h1>
            
            {/* Profile Photo */}
            <div className="mb-8 animate-fade-in">
              <img src="/lovable-uploads/c3c223ba-561b-46c7-a410-e551d6b9a0bf.png" alt="Kian in graduation cap" className="w-64 h-64 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto rounded-2xl object-cover shadow-2xl border border-border/20" />
            </div>
            
            <Card className="bg-card/50 border-border/40 animate-fade-in">
              <CardContent className="p-12">
                <p className="text-xl text-muted-foreground leading-relaxed">Hi, I'm kian. I'm 18 years old, originally from Iran, and currently a student at UC Santa Cruz. I created FroshMeet because I saw how hard it can be to meet people when you're just starting college. Everyone's new, everyone's online, but no one really knows how to break the ice. I wanted to build something that made those first connections easier. FroshMeet helps you find your people before the awkward intros, before the first day, and before college starts to feel lonely.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              © 2025 FroshMeet. All rights reserved. FroshMeet is a registered trademark of FroshMeet LLC. 
              FroshMeet is not officially partnered with any university.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Kian;