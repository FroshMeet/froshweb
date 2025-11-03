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
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, X, CheckCircle2 } from "lucide-react";
import SharedNavigation from "@/components/layout/SharedNavigation";
import { SmartSchoolSearch } from "@/components/SmartSchoolSearch";
import { School } from "@/data/schools";

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
  }),
  referralCode: z.string().optional()
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
  const [referralLocked, setReferralLocked] = useState(false);
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
      agreementRepresent: false,
      referralCode: ""
    }
  });

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    name: "",
    school: "",
    email: ""
  });
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle URL param for referral code
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      form.setValue("referralCode", refCode.toUpperCase());
      setReferralLocked(true);
    }
  }, [searchParams, form]);

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
        p_ref_code: data.referralCode || null
      });

      if (error) throw error;

      const rpcResult = result as any;

      // If there's a referral, send confirmation email
      if (rpcResult?.referral_id) {
        const confirmLink = `${window.location.origin}/hiring/confirm?rid=${rpcResult.referral_id}`;
        
        await fetch(`https://zdicoswxpkpdnmxnhrrn.supabase.co/functions/v1/send-referral-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaWNvc3d4cGtwZG5teG5ocnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjQ4MzYsImV4cCI6MjA2NjQwMDgzNn0.SbKNC7mqGhQTxpAZuJsq4G1y_0DwUDaS2ozmwx4HB9E`
          },
          body: JSON.stringify({
            to: rpcResult.referrer_email,
            referrerName: rpcResult.referrer_name,
            applicantName: data.fullName,
            applicantSchool: data.university,
            confirmLink
          })
        }).catch(console.error);
      }

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

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);

    try {
      const { data, error } = await supabase.rpc("issue_referral_code", {
        p_name: inviteForm.name,
        p_school: inviteForm.school,
        p_email: inviteForm.email
      });

      if (error) throw error;

      const result = data as any;
      const code = result.code;
      const link = `${window.location.origin}/hiring/representatives?ref=${code}`;

      setGeneratedCode(code);
      setGeneratedLink(link);

      // Send the code to the referrer via email
      await fetch(`https://zdicoswxpkpdnmxnhrrn.supabase.co/functions/v1/send-referral-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaWNvc3d4cGtwZG5teG5ocnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjQ4MzYsImV4cCI6MjA2NjQwMDgzNn0.SbKNC7mqGhQTxpAZuJsq4G1y_0DwUDaS2ozmwx4HB9E"}`
        },
        body: JSON.stringify({
          to: inviteForm.email,
          name: inviteForm.name,
          code,
          link
        })
      }).catch(console.error);

      toast({
        title: "Success!",
        description: "Your referral code has been generated and emailed to you."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (applySuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <SharedNavigation />
        <div className="mx-auto max-w-[800px] px-6 md:px-10 py-10 md:py-14">
          <div className="rounded-2xl border border-white/10 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 md:p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">Application Received!</h1>
            <p className="text-white/60 mb-8 text-[15px]">
              Thank you for applying. We will review your application and reach out by email soon.
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95 px-8"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SharedNavigation />
      
      <div className="mx-auto max-w-[800px] px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Become a Frosh Representative
          </h1>
          <p className="text-white/60 text-base md:text-lg">
            Apply below or invite a student from another school to join the team.
          </p>
        </div>

        {/* Compact Invite Banner */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              Invite a Student to Apply
            </h3>
            <p className="text-white/60 text-sm">
              Generate a code and earn up to $500 if they're hired.
            </p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="w-full md:w-auto h-11 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95 whitespace-nowrap px-6"
          >
            Generate Referral Code
          </Button>
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
                          <FormLabel className="text-white/80 text-[14px]">
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
                          <FormLabel className="text-white/80 text-[14px]">
                            I agree to represent my school authentically and professionally as part of the Frosh network. *
                          </FormLabel>
                          <FormMessage className="text-red-400 text-[13px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Referral Code */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-[14px]">Referral Code (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SCHOOL-1234"
                            className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            readOnly={referralLocked}
                          />
                        </FormControl>
                        <p className="text-[13px] text-white/40 mt-1">
                          If you have a referral code, enter it here. Codes are issued by Frosh and tied to a referrer's email.
                        </p>
                        <FormMessage className="text-red-400 text-[13px]" />
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

      {/* Fullscreen Invite Overlay */}
      {showInviteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in p-4 overflow-y-auto"
          onClick={() => {
            if (!generatedCode) {
              setShowInviteModal(false);
            }
          }}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#0d0f12] rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-scale-in my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowInviteModal(false);
                if (generatedCode) {
                  setGeneratedCode(null);
                  setGeneratedLink(null);
                  setInviteForm({ name: "", school: "", email: "" });
                }
              }}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10 pt-14">
              {!generatedCode ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Invite a Student to Apply
                    </h2>
                    <p className="text-white/60">
                      Generate a unique referral code and earn rewards when your referral is hired.
                    </p>
                  </div>

                  {/* How Referrals Work */}
                  <div className="mb-6 space-y-3 bg-black/30 rounded-xl p-6 border border-white/5">
                    <h3 className="text-lg font-semibold">How Referrals Work</h3>
                    <ul className="space-y-2.5 text-sm text-white/70">
                      <li className="flex gap-3">
                        <span className="text-[#015cd2] select-none mt-0.5">•</span>
                        <span>If we hire your referral and their school's account earns revenue, you receive 10% (up to $500)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#015cd2] select-none mt-0.5">•</span>
                        <span>Codes are unique and tied to your email</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#015cd2] select-none mt-0.5">•</span>
                        <span>Self-referrals are not allowed</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#015cd2] select-none mt-0.5">•</span>
                        <span>Confirmation by email is required</span>
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleInviteSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="invite-name" className="text-sm font-medium">
                        Your Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="invite-name"
                        type="text"
                        value={inviteForm.name}
                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                        required
                        className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="invite-school" className="text-sm font-medium">
                        Your School <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="invite-school"
                        type="text"
                        value={inviteForm.school}
                        onChange={(e) => setInviteForm({ ...inviteForm, school: e.target.value })}
                        required
                        className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                        placeholder="Enter your university"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="invite-email" className="text-sm font-medium">
                        Your Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                        required
                        className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40"
                        placeholder="your.email@example.com"
                      />
                      <p className="text-xs text-white/50">
                        Your code will be emailed to you for safekeeping.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isInviting}
                      className="w-full h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95 disabled:opacity-60"
                      aria-busy={isInviting}
                    >
                      {isInviting ? "Generating..." : "Generate My Referral Code"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Your Referral Code</h3>
                    <div className="inline-block bg-black/50 px-6 py-3 rounded-xl border border-white/10 mb-4">
                      <code className="text-2xl font-mono font-bold text-[#015cd2]">
                        {generatedCode}
                      </code>
                    </div>
                    <p className="text-sm text-white/60 mb-4">
                      Share this link with potential representatives:
                    </p>
                    <div className="bg-black/40 rounded-xl border border-white/10 p-4 mb-4">
                      <p className="text-sm text-white/80 break-all mb-3">
                        {generatedLink}
                      </p>
                      <Button
                        onClick={() => {
                          if (generatedLink) {
                            navigator.clipboard.writeText(generatedLink);
                            toast({ title: "Link copied to clipboard!" });
                          }
                        }}
                        className="w-full h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                      >
                        Copy Link
                      </Button>
                    </div>
                    <p className="text-xs text-white/50 mb-6">
                      Your code has been emailed to you for safekeeping.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowInviteModal(false);
                      setGeneratedCode(null);
                      setGeneratedLink(null);
                      setInviteForm({ name: "", school: "", email: "" });
                    }}
                    className="w-full h-11 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
