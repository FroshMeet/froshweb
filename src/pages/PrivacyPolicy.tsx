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
              <p className="text-sm text-muted-foreground mb-4">
                Effective Date: 07/25/2025
              </p>
              
              <p>
                Frosh collects limited personal information provided voluntarily by users, including name, school, graduation year, and profile media. This information is used for the purpose of showcasing student profiles and enabling social discovery.
              </p>
              
              <p>
                Submitted data may also be used for promotional purposes, such as being featured on Instagram accounts affiliated with Frosh.
              </p>
              
              <p>
                All user data is securely stored through Supabase. Frosh does not sell, rent, or share personal information with third parties for marketing purposes.
              </p>
              
              <p>
                Users may request the correction or deletion of their profile and personal data at any time by contacting{" "}
                <a href="mailto:support@getfrosh.com" className="text-primary hover:text-primary/80 underline font-semibold">
                  support@getfrosh.com
                </a>
                .
              </p>
              
              <p>
                By using Frosh, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8">
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@getfrosh.com" className="text-primary hover:text-primary/80 underline">
                support@getfrosh.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;