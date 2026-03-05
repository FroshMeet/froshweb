import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import FroshLogo from "@/components/ui/FroshLogo";

interface SharedNavigationProps {
  currentPage?: string;
}

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

const SharedNavigation = (_props?: SharedNavigationProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <FroshLogo size={isMobile ? "sm" : "md"} onClick={() => navigate('/')} />

        {!isMobile && (
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <Button
          onClick={() => navigate('/download')}
          className="rounded-full px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
        >
          Get Frosh
        </Button>
      </div>
    </header>
  );
};

export default SharedNavigation;
