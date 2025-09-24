import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SharedNavigationProps {
  currentPage?: string;
}

const SharedNavigation = ({ currentPage }: SharedNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine current page from location if not provided
  const getCurrentPage = () => {
    if (currentPage) return currentPage;
    const path = location.pathname;
    if (path === '/features') return 'features';
    if (path === '/community') return 'community';
    if (path === '/contact') return 'contact';
    if (path === '/about') return 'about';
    return '';
  };

  const activePage = getCurrentPage();

  const getButtonClassName = (page: string) => {
    return activePage === page 
      ? "text-primary font-semibold" 
      : "text-muted-foreground hover:text-foreground";
  };

  const getMobileButtonClassName = (page: string) => {
    return `w-full text-left justify-start text-lg py-4 transition-all duration-200 ${
      activePage === page 
        ? "text-primary bg-primary/10 font-semibold" 
        : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
    }`;
  };

  return (
    <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img 
              src="/lovable-uploads/fresh_meat_app_icon-4.png"
              alt="FroshMeet Logo" 
              className={isMobile ? "h-10 w-auto" : "h-16 w-auto"}
            />
          </div>
          
          {/* Centered Navigation - Desktop Only */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/features')} 
                className={getButtonClassName('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/community')} 
                className={getButtonClassName('community')}
              >
                Community
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/contact')} 
                className={getButtonClassName('contact')}
              >
                Contact
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/about')} 
                className={getButtonClassName('about')}
              >
                About
              </Button>
            </div>
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90">
              Join FroshMeet Now
            </Button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-2xl z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {/* App CTA - Top Option */}
              <Button 
                onClick={() => {
                  navigate('/app');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left justify-start text-lg py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
              >
                FreshMeat App 📱
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate('/features');
                  setIsMobileMenuOpen(false);
                }}
                className={getMobileButtonClassName('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate('/community');
                  setIsMobileMenuOpen(false);
                }}
                className={getMobileButtonClassName('community')}
              >
                Community
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate('/contact');
                  setIsMobileMenuOpen(false);
                }}
                className={getMobileButtonClassName('contact')}
              >
                Contact
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate('/about');
                  setIsMobileMenuOpen(false);
                }}
                className={getMobileButtonClassName('about')}
              >
                About
              </Button>
              
              {/* Mobile Action Buttons */}
              <div className="border-t border-border/40 pt-4 mt-4 flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-base border-primary/30 text-primary hover:bg-primary/10"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                >
                  Join FroshMeet Now
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default SharedNavigation;