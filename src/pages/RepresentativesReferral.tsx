import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";
import SharedNavigation from "@/components/layout/SharedNavigation";

export default function RepresentativesReferral() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Apply form state
  const [applyForm, setApplyForm] = useState({
    name: "",
    school: "",
    email: "",
    instagram: "",
    tiktok: "",
    referralCode: ""
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [referralLocked, setReferralLocked] = useState(false);

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

  // Admin view state
  const [showAdmin, setShowAdmin] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Handle URL param for referral code
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setApplyForm(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
      setReferralLocked(true);
    }
  }, [searchParams]);

  // Check for admin param
  useEffect(() => {
    const adminParam = searchParams.get("admin");
    if (adminParam === "1") {
      setShowAdmin(true);
      loadAdminData();
    }
  }, [searchParams]);

  const loadAdminData = async () => {
    setLoadingAdmin(true);
    try {
      const [appsResult, refsResult] = await Promise.all([
        supabase.rpc("get_applications_with_referrals"),
        supabase.rpc("get_all_referrals")
      ]);

      if (appsResult.error) throw appsResult.error;
      if (refsResult.error) throw refsResult.error;

      setApplications(appsResult.data || []);
      setReferrals(refsResult.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      const socials: any = {};
      if (applyForm.instagram) socials.instagram = applyForm.instagram;
      if (applyForm.tiktok) socials.tiktok = applyForm.tiktok;

      const { data, error } = await supabase.rpc("submit_rep_application", {
        p_name: applyForm.name,
        p_school: applyForm.school,
        p_email: applyForm.email,
        p_socials: socials,
        p_ref_code: applyForm.referralCode || null
      });

      if (error) throw error;

      const result = data as any;

      // If there's a referral, send confirmation email
      if (result?.referral_id) {
        const confirmLink = `${window.location.origin}/hiring/confirm?rid=${result.referral_id}`;
        
        // Send email via Resend edge function (you'll need to create this)
        await fetch(`https://zdicoswxpkpdnmxnhrrn.supabase.co/functions/v1/send-referral-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaWNvc3d4cGtwZG5teG5ocnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjQ4MzYsImV4cCI6MjA2NjQwMDgzNn0.SbKNC7mqGhQTxpAZuJsq4G1y_0DwUDaS2ozmwx4HB9E`
          },
          body: JSON.stringify({
            to: result.referrer_email,
            referrerName: result.referrer_name,
            applicantName: applyForm.name,
            applicantSchool: applyForm.school,
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

  const updateReferralStatus = async (referralId: string, status: string) => {
    try {
      const { error } = await supabase.rpc("update_referral_status", {
        p_referral_id: referralId,
        p_status: status
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Referral status updated to ${status}`
      });

      loadAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (applySuccess) {
    return (
      <div className="min-h-screen bg-background">
        <SharedNavigation />
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Application Received!</CardTitle>
              <CardDescription>
                Thank you for applying. We will review your application and reach out by email soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedNavigation />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Become a Frosh Representative</h1>
          <p className="text-xl text-muted-foreground">
            Or invite someone else and earn up to $500 if they are hired
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Apply Card */}
          <Card>
            <CardHeader>
              <CardTitle>Apply to be a Representative</CardTitle>
              <CardDescription>
                Join our team and represent Frosh at your school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="apply-name">Full Name</Label>
                  <Input
                    id="apply-name"
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="apply-school">School</Label>
                  <Input
                    id="apply-school"
                    value={applyForm.school}
                    onChange={(e) => setApplyForm({ ...applyForm, school: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="apply-email">Email</Label>
                  <Input
                    id="apply-email"
                    type="email"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="apply-instagram">Instagram (optional)</Label>
                  <Input
                    id="apply-instagram"
                    value={applyForm.instagram}
                    onChange={(e) => setApplyForm({ ...applyForm, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="apply-tiktok">TikTok (optional)</Label>
                  <Input
                    id="apply-tiktok"
                    value={applyForm.tiktok}
                    onChange={(e) => setApplyForm({ ...applyForm, tiktok: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="apply-ref">Referral Code (optional)</Label>
                  <Input
                    id="apply-ref"
                    value={applyForm.referralCode}
                    onChange={(e) => setApplyForm({ ...applyForm, referralCode: e.target.value.toUpperCase() })}
                    readOnly={referralLocked}
                    placeholder="SCHOOL-1234"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If you have a referral code, enter it here. Codes are issued by Frosh and tied to a referrer's email.
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={isApplying}>
                  {isApplying ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Invite Card */}
          <Card>
            <CardHeader>
              <CardTitle>Invite a Student to Apply</CardTitle>
              <CardDescription>
                Generate a referral code and earn rewards when they're hired
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <p>
                  <strong>How referrals work:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>If we hire your referral and their school's account earns revenue, you receive 10% up to $500</li>
                  <li>Codes are unique and tied to your email</li>
                  <li>Manual names do not qualify</li>
                  <li>Self referrals are not allowed</li>
                  <li>Confirmation by email is required</li>
                </ul>
              </div>
              
              <Button onClick={() => setShowInviteModal(true)} className="w-full">
                Generate Referral Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section */}
        {showAdmin && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAdmin ? (
                  <p>Loading...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">School</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Referral Code</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.app_id} className="border-b">
                            <td className="p-2">{app.app_name}</td>
                            <td className="p-2">{app.app_school}</td>
                            <td className="p-2">{app.app_email}</td>
                            <td className="p-2">{app.referral_code || "—"}</td>
                            <td className="p-2">{app.referral_status || "—"}</td>
                            <td className="p-2">{new Date(app.app_created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Referrer</th>
                        <th className="text-left p-2">Applicant</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Confirmed</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((ref) => (
                        <tr key={ref.referral_id} className="border-b">
                          <td className="p-2">
                            <div>{ref.referrer_name}</div>
                            <div className="text-xs text-muted-foreground">{ref.referrer_email}</div>
                          </td>
                          <td className="p-2">
                            <div>{ref.applicant_name}</div>
                            <div className="text-xs text-muted-foreground">{ref.applicant_email}</div>
                          </td>
                          <td className="p-2">{ref.status}</td>
                          <td className="p-2">{ref.confirmed_at ? new Date(ref.confirmed_at).toLocaleDateString() : "—"}</td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReferralStatus(ref.referral_id, "hired")}
                              >
                                Hired
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReferralStatus(ref.referral_id, "earning")}
                              >
                                Earning
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReferralStatus(ref.referral_id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {generatedCode ? "Your Referral Code" : "Generate Referral Code"}
            </DialogTitle>
            <DialogDescription>
              {generatedCode 
                ? "Share this link with potential representatives"
                : "Enter your information to generate a unique referral code"
              }
            </DialogDescription>
          </DialogHeader>

          {generatedCode ? (
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-3xl font-bold mb-2">{generatedCode}</div>
                <div className="text-sm text-muted-foreground break-all">{generatedLink}</div>
              </div>
              
              <Button onClick={copyLink} className="w-full">
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

              <p className="text-xs text-muted-foreground text-center">
                Codes are unique and tied to your email. One code per email. Self referrals are not allowed.
                You will be asked to confirm referrals by email within 7 days.
              </p>

              <Button variant="outline" onClick={() => {
                setShowInviteModal(false);
                setGeneratedCode(null);
                setGeneratedLink(null);
                setInviteForm({ name: "", school: "", email: "" });
              }}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <Label htmlFor="invite-name">Your Name</Label>
                <Input
                  id="invite-name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="invite-school">Your School</Label>
                <Input
                  id="invite-school"
                  value={inviteForm.school}
                  onChange={(e) => setInviteForm({ ...inviteForm, school: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="invite-email">Your Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isInviting}>
                {isInviting ? "Generating..." : "Generate Code"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
