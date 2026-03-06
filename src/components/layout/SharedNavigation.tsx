import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
  const [open, setOpen] = useState(false);

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

        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-background border-border/30">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-1 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}

          <Button
            onClick={() => navigate('/download')}
            className="rounded-full px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Frosh
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SharedNavigation;
