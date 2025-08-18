import { Button } from "@/components/ui/button";
import { Instagram, Music2, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/40 bg-card/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png" alt="FroshMeet Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-foreground">FroshMeet</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              The trusted platform for college freshmen to connect, network, and build lasting friendships 
              before stepping foot on campus.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => window.open('https://www.instagram.com/froshmeet/', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => window.open('https://www.tiktok.com/@froshmeet', '_blank')}
              >
                <Music2 className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => window.open('https://www.youtube.com/@FroshMeet', '_blank')}
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:contents gap-8 md:gap-0 md:col-span-2">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  About
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Features
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Contact
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/privacy-policy')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Privacy Policy
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/terms-of-service')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Terms of Service
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/cookie-policy')} className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Cookie Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            © 2025 FroshMeet. All rights reserved. FroshMeet is a registered trademark of FroshMeet LLC. 
            <br className="md:hidden" />
            FroshMeet is student-run and not affiliated with any college or university. 
            <br className="md:hidden" />
            Use of this website constitutes acceptance of our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;