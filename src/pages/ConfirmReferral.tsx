import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import SharedNavigation from "@/components/layout/SharedNavigation";

export default function ConfirmReferral() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rid = searchParams.get("rid");
    
    if (!rid) {
      setStatus("error");
      setMessage("Invalid confirmation link. No referral ID provided.");
      return;
    }

    confirmReferral(rid);
  }, [searchParams]);

  const confirmReferral = async (referralId: string) => {
    try {
      const { error } = await supabase.rpc("confirm_referral", {
        p_referral_id: referralId
      });

      if (error) throw error;

      setStatus("success");
      setMessage("Referral confirmed successfully! Thank you for confirming this referral.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to confirm referral. The link may be invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SharedNavigation />
      
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === "loading" && "Confirming Referral..."}
              {status === "success" && (
                <>
                  <Check className="w-6 h-6 text-green-500" />
                  Referral Confirmed
                </>
              )}
              {status === "error" && (
                <>
                  <X className="w-6 h-6 text-red-500" />
                  Confirmation Failed
                </>
              )}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status === "success" && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm">
                    Your referral has been confirmed. If your referred candidate is hired and their school
                    generates revenue, you will be eligible to earn up to $500 (10% of school revenue).
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={() => navigate("/")}>
                  Back to Home
                </Button>
                <Button variant="outline" onClick={() => navigate("/hiring/representatives")}>
                  View Representative Program
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
