import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                FroshMeet collects limited information provided by users, such as name, school, graduation year, and profile media, for the purpose of showcasing student profiles and enabling social discovery.
              </p>
              
              <p>
                We may use submitted data for promotional purposes, such as posting it to Instagram accounts associated with FroshMeet.
              </p>
              
              <p>
                All information is securely stored via Supabase. We do not sell personal data to third parties.
              </p>
              
              <p>
                Users may request edits or deletion of their profile by contacting{" "}
                <a href="mailto:support@froshmeet.com" className="text-primary hover:text-primary/80 underline">
                  support@froshmeet.com
                </a>
                .
              </p>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8">
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@froshmeet.com" className="text-primary hover:text-primary/80 underline">
                support@froshmeet.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;