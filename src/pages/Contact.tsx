import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Instagram } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Contact form submission logic would go here
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground">
                Community
              </Button>
              <Button variant="ghost" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">
                About
              </Button>
              <Button variant="ghost" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground">
                Features
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')} className="text-foreground">
                Contact
              </Button>
            </nav>
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
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              We'd love to{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                hear from you
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions, feedback, or need support? Our team is here to help you make the most of your FroshMeet experience.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in">
                <Card className="bg-card/50 border-border/40">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Name
                        </label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="h-12 bg-background/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="h-12 bg-background/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <Textarea
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="min-h-32 bg-background/50"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="animate-slide-in-right">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-6">Get in touch with us</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      Whether you have questions about features, need technical support, or want to share feedback, 
                      we're here to help make your college connection experience amazing.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-card/50 border-border/40 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/40 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2">Email Support</h3>
                          <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                          <a href="mailto:support@froshmeet.com" className="text-primary hover:text-primary/80 transition-colors">
                            support@froshmeet.com
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-card/50 border-border/40 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-purple-500/40 rounded-xl flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2">Social Media</h3>
                          <p className="text-muted-foreground mb-2">Follow us for updates and community highlights</p>
                          <a 
                            href="https://instagram.com/froshmeet" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            @FroshMeet
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-card/50 border-border/40 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-green-600/40 rounded-xl flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2">Live Chat</h3>
                          <p className="text-muted-foreground mb-2">Quick support through the app</p>
                          <Button 
                            size="sm" 
                            onClick={() => navigate('/community')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Visit Community
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="pt-8 border-t border-border/40">
                    <h3 className="font-bold text-foreground mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">How do I verify my student status?</p>
                        <p className="text-muted-foreground">You'll need your university email address and student ID during registration.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Is FroshMeet free to use?</p>
                        <p className="text-muted-foreground">Yes! FroshMeet is completely free for all college students.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">How do you ensure user safety?</p>
                        <p className="text-muted-foreground">We verify all users, moderate conversations, and have strict community guidelines.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default Contact;