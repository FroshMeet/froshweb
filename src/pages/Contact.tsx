import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Instagram } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      if (error) {
        console.error('Error sending contact email:', error);
        toast.error("Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({ name: "", email: "", message: "" });
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src={isMobile ? "/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png" : "/lovable-uploads/e9020b20-5a8d-4a80-a4e0-9d917c7c5e5c.png"}
                alt="FroshMeet Logo" 
                className={isMobile ? "h-10 w-auto" : "h-16 w-auto"}
              />
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
                <Button variant="ghost" onClick={() => navigate('/contact')} className="text-foreground">
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="animate-slide-in-right h-full flex flex-col">
                <div className="space-y-8 flex-1">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-6">Get in touch with us</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      Whether you have questions about features, need technical support, or want to share feedback, 
                      we're here to help make your college connection experience amazing.
                    </p>
                  </div>

                  <div className="space-y-6 flex-1">
                    <Card className="bg-card/50 border-border/40 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/40 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-2">Email Support</h3>
                          <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                          <a href="mailto:support@froshmeet.com" className="text-primary hover:text-primary/80 transition-colors">
                            support@froshmeet.com
                          </a>
                          <p className="text-xs text-muted-foreground mt-2">We typically respond within 24 hours</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-card/50 border-border/40 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-purple-500/40 rounded-xl flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div className="flex-1">
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
                          <p className="text-xs text-muted-foreground mt-2">Join our growing community</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section - Full Width */}
            <div className="mt-16">
              <div className="animate-fade-in">
                <Card className="bg-card/50 border-border/40">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-medium text-foreground mb-2">How do I verify my student status?</p>
                        <p className="text-muted-foreground text-sm">You'll need your university email address and student ID during registration.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">Is FroshMeet free to use?</p>
                        <p className="text-muted-foreground text-sm">Yes! FroshMeet is completely free for all college students.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">How do you ensure user safety?</p>
                        <p className="text-muted-foreground text-sm">We verify all users, moderate conversations, and have strict community guidelines.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">What universities does FroshMeet support?</p>
                        <p className="text-muted-foreground text-sm">We support all major universities and colleges in the US. Check our university list during signup.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">Can I change my profile information later?</p>
                        <p className="text-muted-foreground text-sm">Yes, you can edit your profile, photos, and interests anytime through the app settings.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">How do I report inappropriate behavior?</p>
                        <p className="text-muted-foreground text-sm">Use the report button on any profile or message. Our team reviews all reports within 24 hours.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">Why can't I see all profiles?</p>
                        <p className="text-muted-foreground text-sm">We only show verified students from your university and nearby schools for safety.</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">How do roommate matching features work?</p>
                        <p className="text-muted-foreground text-sm">Answer compatibility questions and we'll suggest potential roommates based on lifestyle preferences.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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