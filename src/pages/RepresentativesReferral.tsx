import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { SmartSchoolSearch } from "@/components/SmartSchoolSearch";
import { School } from "@/data/schools";
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

export default function RepresentativesReferral() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Apply form state
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showSocialDetails, setShowSocialDetails] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
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

  useEffect(() => {
    if (applySuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [applySuccess]);

  const handleApplySubmit = async (data: FormData) => {
    if (isApplying) return;
    setIsApplying(true);

    try {
      const socials: any = {};
      if (data.instagramHandle) socials.instagram = data.instagramHandle;

      const { data: result, error } = await supabase.rpc("submit_rep_application", {
        p_name: data.fullName,
        p_school: data.university,
        p_email: data.email || "",
        p_socials: socials,
        p_ref_code: null
      });

      if (error) throw error;

      setApplySuccess(true);
      toast({
        title: "Success!",
        description: "Application received. We will reach out by email."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };


  if (applySuccess) {
    return (
      <div className="min-h-screen bg-[#0c1008] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-[#0c1008] border-[#015cd2]/40 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-[#015cd2] mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              Thanks. We will review and get back to you soon.
            </h1>
            <p className="text-white/70 mb-8">
              We appreciate your interest in becoming a Frosh representative.
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
    <div className="min-h-screen bg-[#0c1008] text-white">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/hiring')}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="mx-auto max-w-[800px] px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <img src={froshLogo} alt="Frosh Logo" className="h-20 mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(1,92,210,0.6)]" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Become a Frosh Representative
          </h1>
          <p className="text-white/60 text-base md:text-lg">
            Apply below to join the Frosh team at your school.
          </p>
        </div>

        {/* Application Form Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Apply to be a Representative
            </h2>
            <p className="text-white/60 text-sm">
              Fill out the form below to join the Frosh team.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleApplySubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-[16px] font-medium text-white/90">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">Instagram Handle</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="@johndoe" 
                            className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="john@email.com" 
                            type="email"
                            className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />
                  
                  <p className="text-[13px] text-white/40">* At least one contact method is required</p>

                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">University *</FormLabel>
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
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">Graduation Year *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white focus:ring-2 focus:ring-[#015cd2]/40">
                              <SelectValue placeholder="Select graduation year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["2026", "2027", "2028", "2029", "2030"].map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quick Questions */}
                <div className="space-y-4">
                  <h3 className="text-[16px] font-medium text-white/90">Quick Questions</h3>
                  
                  <FormField
                    control={form.control}
                    name="timeCommitment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">
                          Are you able to dedicate 2-4 hours per week to managing your school's Frosh account? *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white focus:ring-2 focus:ring-[#015cd2]/40">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyFit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">
                          What makes you a good fit to represent your school on Frosh? *
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share why you'd be great for this role (2-3 sentences)" 
                            className="w-full min-h-[100px] rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramFamiliarity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">How familiar are you with Instagram? *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white focus:ring-2 focus:ring-[#015cd2]/40">
                              <SelectValue placeholder="Select your familiarity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unfamiliar">Unfamiliar</SelectItem>
                            <SelectItem value="familiar">Familiar</SelectItem>
                            <SelectItem value="very-familiar">Very Familiar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMediaExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">
                          Have you managed or helped grow any social media pages before? *
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setShowSocialDetails(value === "yes");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white focus:ring-2 focus:ring-[#015cd2]/40">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-[13px]" />
                      </FormItem>
                    )}
                  />

                  {showSocialDetails && (
                    <FormField
                      control={form.control}
                      name="socialMediaDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-[14px]">Please provide details (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your social media experience" 
                              className="w-full min-h-[80px] rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-[13px]" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Agreement */}
                <div className="space-y-4">
                  <h3 className="text-[16px] font-medium text-white/90">Agreement</h3>
                  
                  <FormField
                    control={form.control}
                    name="agreementRevenue"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white/80 text-[13.5px]">
                            I understand this role is compensated through revenue sharing (40% of my school's account earnings). *
                          </FormLabel>
                          <FormMessage className="text-red-400 text-[13px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreementRepresent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white/80 text-[13.5px]">
                            I agree to represent my school authentically and professionally as part of the Frosh network. *
                          </FormLabel>
                          <FormMessage className="text-red-400 text-[13px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95 disabled:opacity-60"
                disabled={isApplying}
                aria-busy={isApplying}
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            For questions or more information, contact{" "}
            <a href="mailto:kian@frosh.app" className="text-[#015cd2] hover:brightness-110 transition">
              kian@frosh.app
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
