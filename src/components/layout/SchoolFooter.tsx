import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink } from "lucide-react";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";

interface SchoolFooterProps {
  currentSchool?: string;
}

export const SchoolFooter: React.FC<SchoolFooterProps> = ({ currentSchool }) => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(currentSchool || "");

  const handleSchoolChange = (schoolSlug: string) => {
    if (schoolSlug && schoolSlug !== currentSchool) {
      navigate(`/${schoolSlug}`);
    }
  };

  return (
    <footer className="bg-card/30 border-t border-border/40 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* School Switcher */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Switch Schools</h3>
            </div>
            <Select value={selectedSchool} onValueChange={handleSchoolChange}>
              <SelectTrigger className="bg-muted/30 border-border/40">
                <SelectValue placeholder="Choose your school..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                {Object.entries(APPROVED_SCHOOLS).map(([slug, school]) => (
                  <SelectItem key={slug} value={slug}>
                    <div className="flex items-center justify-between w-full">
                      <span>{school.displayName}</span>
                      {school.instagramUsername && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          @{school.instagramUsername}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/privacy-policy')}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/terms-of-service')}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/contact')}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* FroshMeet Branding */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">FroshMeet</h3>
            <p className="text-sm text-muted-foreground">
              Connecting college freshmen nationwide. Find your people before day one.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/app')}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Download App
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-primary font-bold"
              >
                FroshMeet
              </Button>
              <span className="text-xs text-muted-foreground">
                © 2024 FroshMeet. Making college connections easy.
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Built for the Class of 2030 🎓
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SchoolFooter;