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
import { Copy, Check } from "lucide-react";
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
      <div className="min-h-screen bg-[#0d0d0d]">
        <SharedNavigation />
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14">
          <div className="rounded-2xl border border-white/10 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 md:p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">Application Received!</h1>
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
    <div className="min-h-screen bg-[#0d0d0d]">
      <SharedNavigation />
      
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            Become a Frosh Representative
          </h1>
          <p className="text-base md:text-lg text-white/60">
            Or invite someone else and earn up to 500 dollars if they are hired.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          {/* Apply Card - Left Column */}
          <div className="rounded-2xl border border-white/8 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <h2 className="text-[22px] md:text-[24px] font-medium text-white mb-2">
              Apply to be a Representative
            </h2>
            <p className="text-[14px] text-white/50 mb-6">
              Join our team and represent Frosh at your school
            </p>

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

          {/* Invite Card - Right Column */}
          <div className="rounded-2xl border border-white/8 bg-[#0d0f12] shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 md:p-8">
            <h2 className="text-[22px] md:text-[24px] font-medium text-white mb-2">
              Invite a Student to Apply
            </h2>
            <p className="text-[14px] text-white/50 mb-6">
              Generate a referral code and earn rewards when they are hired
            </p>

            <div className="space-y-4 mb-6">
              <h3 className="text-[16px] font-medium text-white/90">How referrals work</h3>
              <ul className="space-y-2 text-[15px] text-white/60 pl-5">
                <li className="list-disc">If we hire your referral and their school's account earns revenue, you receive 10 percent up to 500 dollars</li>
                <li className="list-disc">Codes are unique and tied to your email</li>
                <li className="list-disc">Manual names do not qualify</li>
                <li className="list-disc">Self referrals are not allowed</li>
                <li className="list-disc">Confirmation by email is required</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setShowInviteModal(true)} 
              className="w-full h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95"
            >
              Generate Referral Code
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="rounded-2xl border border-white/10 bg-[#0d0f12] text-white max-w-md transition-all duration-150 ease-in-out">
          <DialogHeader>
            <DialogTitle className="text-[22px] font-medium text-white">
              {generatedCode ? "Your Referral Code" : "Generate Referral Code"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {generatedCode 
                ? "Share this link with potential representatives"
                : "Enter your information to generate a unique referral code"
              }
            </DialogDescription>
          </DialogHeader>

          {generatedCode ? (
            <div className="space-y-4 mt-4">
              <div className="text-center p-6 bg-black/40 rounded-xl border border-white/10">
                <div className="text-3xl font-mono font-bold mb-3 text-white">{generatedCode}</div>
                <div className="text-[13px] text-white/50 break-all">{generatedLink}</div>
              </div>
              
              <Button 
                onClick={copyLink} 
                className="w-full h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>

              <p className="text-[13px] text-white/40 text-center">
                Codes are unique and tied to your email. One code per email. Self referrals are not allowed.
                You will be asked to confirm referrals by email within 7 days.
              </p>

              <Button 
                variant="outline" 
                onClick={() => {
                  setShowInviteModal(false);
                  setGeneratedCode(null);
                  setGeneratedLink(null);
                  setInviteForm({ name: "", school: "", email: "" });
                }}
                className="w-full h-12 rounded-xl border-white/20 hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInviteSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="invite-name" className="text-white/80 text-[14px]">Your Name</Label>
                <Input
                  id="invite-name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40 mt-2"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="invite-school" className="text-white/80 text-[14px]">Your School</Label>
                <Input
                  id="invite-school"
                  value={inviteForm.school}
                  onChange={(e) => setInviteForm({ ...inviteForm, school: e.target.value })}
                  className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40 mt-2"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="invite-email" className="text-white/80 text-[14px]">Your Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#015cd2]/40 mt-2"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-[#015cd2] text-white font-medium transition hover:brightness-95 disabled:opacity-60"
                disabled={isInviting}
                aria-busy={isInviting}
              >
                {isInviting ? "Generating..." : "Generate Code"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
