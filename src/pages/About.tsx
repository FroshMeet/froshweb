import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Heart, Target, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SharedNavigation from "@/components/layout/SharedNavigation";
import { SEO } from "@/components/seo/SEO";
import { organizationSchema, websiteSchema, faqSchema } from "@/utils/seoSchema";
const About = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return <div className="min-h-screen bg-background">
      <SEO
        title="About Frosh | The Leading College Social App for Students"
        description="Frosh is the college social app connecting incoming students and the Class of 2030 before Move-In Day. Learn about our mission to help college freshmen find roommates, join communities, and build lasting friendships at universities nationwide."
        keywords="about frosh, about frosh app, frosh startup, frosh mission, college social platform mission, freshman networking platform, student community app, college connections, Class of 2030, frosh story, frosh company"
        canonical="/about"
        schema={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, websiteSchema]
        }}
      />
      <SharedNavigation currentPage="about" />

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Our Story
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Building connections that{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                last a lifetime
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Frosh was born from the simple idea that college should be about more than just classes. 
              It's about finding your people, building meaningful relationships, and creating memories that shape your future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We believe every college freshman deserves to find their community before day one
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h3 className="text-3xl font-bold text-foreground mb-6">Why Frosh Exists</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Starting college can be overwhelming. You're entering a new environment, meeting hundreds of new people, 
                  and trying to figure out where you belong. That's where Frosh comes in.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We created a safe, verified platform specifically for incoming freshmen to connect with their future 
                  classmates, find compatible roommates, and build study groups before they even step foot on campus.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
                <Card className="bg-card/50 border-border/40 p-6 text-center">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground mb-2">100+</h4>
                  <p className="text-sm text-muted-foreground">Supported Schools</p>
                </Card>
                <Card className="bg-card/50 border-border/40 p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground mb-2">100%</h4>
                  <p className="text-sm text-muted-foreground">Verified Students</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Core Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Frosh
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Community First</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe in the power of authentic connections and building inclusive communities where everyone belongs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{
              animationDelay: '0.1s'
            }}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Safety & Trust</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your safety is our priority. We verify every student and maintain a secure, moderated environment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{
              animationDelay: '0.2s'
            }}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Authenticity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We encourage genuine connections based on shared interests, values, and goals - not superficial metrics.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quote Section */}
            <div className="text-center mt-16 animate-fade-in">
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground italic mb-6 max-w-4xl mx-auto">
                "College is more fun when it doesn't start with blank faces and awkward dms."
              </blockquote>
               <p className="text-lg text-muted-foreground">
                 <Button variant="link" onClick={() => navigate('/kian')} className="text-primary hover:text-primary/80 p-0 h-auto font-normal text-lg underline-offset-4">
                   - kian, Founder of Frosh
                 </Button>
               </p>
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
                Ready to find your college community?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who have already found their people through Frosh
              </p>
              <Button size="lg" onClick={() => navigate('/community')} className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto">
                Start Connecting Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      
    </div>;
};
export default About;