import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo/SEO";
import { SmartSchoolSearch } from "@/components/SmartSchoolSearch";
import { School } from "@/data/schools";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import froshLogo from "@/assets/frosh-logo-new.png";
const formSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(100),
  instagramHandle: z.string().max(255).optional(),
  email: z.string().max(255).optional(),
  university: z.string().min(1, "Please select your university"),
  graduationYear: z.string().min(1, "Please select your graduation year"),
  timeCommitment: z.enum(["yes", "no"], {
    required_error: "Please select an option"
  }),
  whyFit: z.string().min(20, "Please write at least 2-3 sentences").max(500),
  instagramFamiliarity: z.enum(["unfamiliar", "familiar", "very-familiar"], {
    required_error: "Please select your familiarity level"
  }),
  socialMediaExperience: z.enum(["yes", "no"]),
  socialMediaDetails: z.string().optional(),
  agreementRevenue: z.boolean().refine(val => val === true, {
    message: "You must agree to continue"
  }),
  agreementRepresent: z.boolean().refine(val => val === true, {
    message: "You must agree to continue"
  })
}).refine(data => data.instagramHandle || data.email, {
  message: "Please provide either an Instagram handle or email",
  path: ["instagramHandle"]
});
type FormData = z.infer<typeof formSchema>;
const Representatives = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showSocialDetails, setShowSocialDetails] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      instagramHandle: "",
      email: "",
      university: "",
      graduationYear: "",
      whyFit: "",
      socialMediaDetails: "",
      agreementRevenue: false,
      agreementRepresent: false
    }
  });
  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('submit-hiring-application', {
        body: {
          fullName: data.fullName,
          instagramHandle: data.instagramHandle,
          email: data.email,
          university: data.university,
          graduationYear: data.graduationYear,
          timeCommitment: data.timeCommitment,
          whyFit: data.whyFit,
          instagramFamiliarity: data.instagramFamiliarity,
          socialMediaExperience: data.socialMediaExperience,
          socialMediaDetails: data.socialMediaDetails,
          agreementRevenue: data.agreementRevenue,
          agreementRepresent: data.agreementRepresent,
          idempotencyKey
        }
      });

      if (error) {
        console.error('Submission error:', error);
        toast.error(error.message || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Check for ok: true response
      if (result?.ok === true) {
        console.log("Application submitted successfully:", result);
        setSubmitted(true);
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }, 100);
        return;
      }

      // Handle error response
      if (result?.ok === false && result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      // Fallback error
      toast.error('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An error occurred while submitting your application. Please try again.');
      setIsSubmitting(false);
    }
  };
  const scrollToForm = () => {
    document.getElementById("application-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const graduationYears = ["2026", "2027", "2028", "2029", "2030"];
  if (submitted) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="Application Submitted | Frosh Hiring" description="Thank you for applying to become a Frosh Student Representative" canonical="https://frosh.app/hiring/representatives" />
        <div className="relative">
          <div className="absolute -inset-8 bg-primary/30 rounded-3xl blur-3xl animate-pulse -z-10"></div>
          <Card className="relative max-w-2xl w-full text-center shadow-2xl border-border/40 bg-card z-10">
            <CardContent className="pt-12 pb-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Thanks for applying!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              We'll reach out via Instagram or email if selected.
            </p>
            <div className="text-2xl font-semibold mb-2">
              💙 Where college begins before campus.
            </div>
            <p className="text-lg mb-8">
              Follow us on Instagram <a href="https://www.instagram.com/getfrosh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">@getfrosh</a>
            </p>
            <Button onClick={() => window.location.href = "/"} size="lg" className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <SEO title="Student Representative Application | Frosh Hiring" description="Apply to become a Frosh Student Marketing & Social Media Representative. Represent your school and earn 40% revenue share." canonical="https://frosh.app/hiring/representatives" keywords="frosh hiring, student representative, campus marketing, college social media" />

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
            <div className="flex gap-6">
              <Link to="/" className="text-white hover:text-[#015cd2] transition-colors text-sm font-medium">
                Home
              </Link>
              <Link to="/hiring" className="text-[#015cd2] font-semibold text-sm">
                Hiring
              </Link>
              <Link to="/contact" className="text-white hover:text-[#015cd2] transition-colors text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-[#015cd2] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/hiring" className="hover:text-[#015cd2] transition-colors">Hiring</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Representatives</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-b from-background to-background/95 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src={froshLogo} alt="Frosh Logo" className="h-20 mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(1,92,210,0.6)]" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apply to Become a Frosh Student Marketing & Social Media
            Representative
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help connect your campus before it begins. Represent your school,
            grow your community, and earn 40% of your account's revenue.
          </p>
          <Button onClick={scrollToForm} size="lg" className="bg-primary hover:bg-primary/90 shadow-lg neon-glow">
            Apply Now
          </Button>
        </div>
      </div>

      {/* Application Form */}
      <div id="application-form" className="max-w-3xl mx-auto px-4 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Basic Info */}
            <Card className="shadow-2xl rounded-2xl border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="fullName" render={({
                field
              }) => <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="instagramHandle" render={({
                field
              }) => <FormItem>
                      <FormLabel>Instagram Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="@johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <p className="text-sm text-muted-foreground">* At least one contact method is required</p>

                <FormField control={form.control} name="university" render={({
                field
              }) => <FormItem>
                      <FormLabel>University *</FormLabel>
                      <FormControl>
                        <SmartSchoolSearch
                          onSelect={(school: School) => {
                            setSelectedSchool(school);
                            field.onChange(school.name);
                          }}
                          placeholder="Search for your university..."
                          selectedSchool={selectedSchool}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="graduationYear" render={({
                field
              }) => <FormItem>
                      <FormLabel>Graduation Year *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select graduation year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {graduationYears.map(year => <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </CardContent>
            </Card>

            {/* Section 2: Quick Questions */}
            <Card className="shadow-2xl rounded-2xl border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="timeCommitment" render={({
                field
              }) => <FormItem>
                      <FormLabel>
                        Are you able to dedicate 2–4 hours per week to managing
                        your school's Frosh account? *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="whyFit" render={({
                field
              }) => <FormItem>
                      <FormLabel>
                        What makes you a good fit to represent your school on
                        Frosh? *
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share why you'd be great for this role (2-3 sentences)" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="instagramFamiliarity" render={({
                field
              }) => <FormItem>
                      <FormLabel>
                        How familiar are you with Instagram? *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your familiarity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unfamiliar">Unfamiliar</SelectItem>
                          <SelectItem value="familiar">Familiar</SelectItem>
                          <SelectItem value="very-familiar">
                            Very Familiar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="socialMediaExperience" render={({
                field
              }) => <FormItem>
                      <FormLabel>
                        Have you managed or helped grow any social media pages
                        before? *
                      </FormLabel>
                      <Select onValueChange={value => {
                  field.onChange(value);
                  setShowSocialDetails(value === "yes");
                }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />

                {showSocialDetails && <FormField control={form.control} name="socialMediaDetails" render={({
                field
              }) => <FormItem>
                        <FormLabel>Please provide details (optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about your social media experience" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />}
              </CardContent>
            </Card>

            {/* Section 3: Agreement */}
            <Card className="shadow-2xl rounded-2xl border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="agreementRevenue" render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I understand this role is compensated through revenue sharing (40% of my school's account earnings). *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>} />

                <FormField control={form.control} name="agreementRepresent" render={({
                field
              }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to represent my school authentically and
                          professionally as part of the Frosh network. *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>} />
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 shadow-lg px-12 neon-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Footer */}
      
    </div>;
};
export default Representatives;