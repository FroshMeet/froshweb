import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                FroshMeet uses basic cookies to ensure website functionality and enhance user experience.
              </p>
              
              <p>
                We do not use cookies for advertising or behavioral tracking. Analytics tools (e.g., Plausible or Google Analytics) may collect anonymized usage data to help us improve the platform.
              </p>
              
              <p>
                You may disable cookies in your browser settings if desired, but some features may not work properly.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8">
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Cookie Policy, please contact us at{" "}
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

export default CookiePolicy;