import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo/SEO";
import { ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import froshLogo from "@/assets/frosh-logo-new.png";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  school: z.string().trim().min(2, "School/University is required").max(150, "School name must be less than 150 characters"),
  portfolio: z.string().trim().max(500, "Portfolio/handles must be less than 500 characters").optional(),
  experience: z.string().trim().min(20, "Please write at least 2-3 sentences").max(1000, "Experience must be less than 1000 characters"),
  viralIdea: z.string().trim().min(20, "Please share your idea in detail").max(1000, "Idea must be less than 1000 characters"),
  additional: z.string().trim().max(1000, "Additional info must be less than 1000 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

const HeadOfBrand = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      school: "",
      portfolio: "",
      experience: "",
      viralIdea: "",
      additional: "",
    }
  });

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitted]);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const result = await supabase.functions.invoke("submit-hiring-application", {
        body: {
          applicationType: 'head_of_brand',
          fullName: data.name,
          email: data.email,
          university: data.school,
          portfolio: data.portfolio,
          experience: data.experience,
          viralIdea: data.viralIdea,
          additional: data.additional,
          idempotencyKey: crypto.randomUUID()
        }
      });

      if (result?.data?.ok === true) {
        console.log("Head of Brand Application submitted successfully:", result);
        setSubmitted(true);
        toast.success("Application submitted successfully!");
        return;
      }

      const errorMessage = result?.data?.error || result?.error?.message || "Failed to submit application";
      console.error("Submission error:", errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0c1008] flex items-center justify-center p-4">
        <SEO 
          title="Application Submitted | Head of Brand - Frosh Hiring"
          description="Thank you for applying for the Head of Brand & Content Strategy position at Frosh"
          canonical="https://frosh.app/hiring/head-of-brand"
        />
        <Card className="max-w-2xl w-full bg-[#0c1008] border-[#015cd2]/40 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-[#015cd2] mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              Thanks. We will review and get back to you soon.
            </h1>
            <p className="text-white/70 mb-8">
              We appreciate your interest in leading Frosh's brand and content strategy.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-[#015cd2] hover:bg-[#015cd2]/90 text-white px-8 py-6 rounded-2xl"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1008]">
      <SEO 
        title="Apply: Head of Brand & Content Strategy | Frosh Hiring"
        description="Lead creative direction, short-form content, and social growth for @getfrosh. 5% equity role with monthly vesting."
        canonical="https://frosh.app/hiring/head-of-brand"
        keywords="head of brand, content strategy, social media marketing, frosh jobs"
      />

      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#0c1008]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img 
              src={froshLogo} 
              alt="Frosh Logo" 
              className="h-10 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/hiring')}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <img src={froshLogo} alt="Frosh Logo" className="h-20 mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(1,92,210,0.6)]" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
          Apply: Head of Brand & Content Strategy
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Lead creative direction, short-form content, and social growth for @getfrosh. Tell the Frosh story across TikTok and Instagram. 5% equity role with monthly vesting.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Card className="bg-[#0c1008] border-[#015cd2]/30 shadow-2xl rounded-2xl">
          <CardContent className="pt-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          className="bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com" 
                          className="bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">School / University</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your school or university" 
                          className="bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Social Handles or Portfolio (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="@yourusername, links, etc." 
                          className="bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Experience or Relevant Work</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your experience with content, branding, or social media..." 
                          className="min-h-[120px] bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="viralIdea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">One idea to make Frosh go viral before February 2026</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your viral growth strategy..." 
                          className="min-h-[120px] bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Anything else (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information you'd like to share..." 
                          className="min-h-[100px] bg-[#0c1008] border-white/20 text-white placeholder:text-white/40 focus:border-[#015cd2] focus:ring-[#015cd2]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-2xl px-5 py-6 bg-[#015cd2] hover:bg-[#015cd2]/90 text-white font-semibold text-base transition-all hover:ring-2 hover:ring-[#015cd2] hover:ring-offset-2 hover:ring-offset-[#0c1008]"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Questions or extra materials? <span className="text-white">kian@frosh.app</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadOfBrand;
