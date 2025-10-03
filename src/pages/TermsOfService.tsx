import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const TermsOfService = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
            <p className="text-muted-foreground mt-4">Effective Date: 07/25/2025</p>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">Welcome to Frosh. By using our platform, whether you are submitting a student profile or making a purchase, you agree to the following terms:</p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">By submitting content or making any payment, you acknowledge that you have read, understood, and agree to these Terms.</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">2. No Refunds Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your profile has been reviewed and/or posted, all payments are final. We do not offer refunds under any circumstances.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">3. Authorization to Use Your Content</h2>
                <p className="text-muted-foreground leading-relaxed">You grant Frosh full permission to use your submitted name, photo, school information, bio, and any other content for student discovery, social media posts, and marketing purposes. You confirm that you have the necessary rights to share the content you submit.</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">4. Content Standards</h2>
                <p className="text-muted-foreground leading-relaxed">Users are responsible for ensuring that their submissions are accurate and appropriate. Frosh reserves the right to reject or remove any content that violates our guidelines or standards at our sole discretion.</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">5. Service Changes</h2>
                <p className="text-muted-foreground leading-relaxed">Frosh reserves the right to modify, suspend, or discontinue any features, pricing, or services at any time, with or without notice.</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">6. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of the United States.</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">7. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">We may update these Terms from time to time. Continued use of the platform after any updates constitutes your acceptance of the revised Terms.</p>
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Contact Us:</h3>
              <p className="text-muted-foreground leading-relaxed">
                For questions, reach out to{" "}
                <a href="mailto:support@frosh.app" className="text-primary hover:text-primary/80 underline">
                  support@frosh.app
                </a>
                .
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By using Frosh, you agree to these Terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default TermsOfService;