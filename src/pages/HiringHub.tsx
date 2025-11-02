import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/seo/SEO";
import { Sparkles, Megaphone, ChevronRight, ArrowLeft } from "lucide-react";
import froshLogo from "@/assets/frosh-logo-new.png";

const HiringHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c1008]">
      <SEO 
        title="Frosh Hiring | Head of Brand & Student Representatives"
        description="Join Frosh. Apply for Head of Brand & Content Strategy or become a Student Representative for your school."
        canonical="https://frosh.app/hiring"
        keywords="frosh hiring, head of brand, student representative, college marketing"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://frosh.app"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Hiring",
              "item": "https://frosh.app/hiring"
            }
          ]
        }}
      />

      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#0c1008]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img 
              src={froshLogo} 
              alt="Frosh Logo" 
              className="h-10 cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="flex gap-6">
              <Link to="/" className="text-white hover:text-[#015cd2] transition-colors text-sm font-medium">
                Home
              </Link>
              <Link to="/hiring" className="text-[#015cd2] font-semibold text-sm">
                Hiring
              </Link>
              <Link to="/contact" className="text-white hover:text-[#015cd2] transition-colors text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-[#015cd2] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Hiring</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mt-4 text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 bg-[#015cd2]/30 rounded-full blur-2xl animate-pulse"></div>
          <img 
            src={froshLogo} 
            alt="Frosh Logo" 
            className="h-24 md:h-32 relative z-10 drop-shadow-[0_0_20px_rgba(1,92,210,0.8)]"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
          Frosh Hiring
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          Choose a role to get started.
        </p>
      </div>

      {/* Role Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Head of Brand Card */}
          <Card 
            className="group relative rounded-2xl p-6 md:p-8 bg-[#0c1008] border border-[#015cd2]/30 hover:border-[#015cd2]/60 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-[0_0_30px_rgba(1,92,210,0.3)] cursor-pointer"
            onClick={() => navigate('/hiring/head-of-brand')}
            role="button"
            aria-label="Apply for Head of Brand & Content Strategy position"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/hiring/head-of-brand');
              }
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#015cd2]/0 via-[#015cd2]/20 to-[#015cd2]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            
            <div className="relative flex flex-col h-full">
              <div className="w-14 h-14 rounded-xl bg-[#015cd2]/20 flex items-center justify-center mb-6 group-hover:bg-[#015cd2]/30 transition-colors">
                <Sparkles className="w-7 h-7 text-[#015cd2]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                Head of Brand & Content Strategy
              </h2>
              
              <p className="text-white/70 mb-8 leading-relaxed flex-1">
                Own the story. Lead creative, content, and growth for @getfrosh.
              </p>
              
              <Button 
                className="w-full rounded-2xl px-5 py-6 bg-[#015cd2] hover:bg-[#015cd2]/90 text-white font-semibold transition-all hover:ring-2 hover:ring-[#015cd2] hover:ring-offset-2 hover:ring-offset-[#0c1008] group-hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#015cd2] focus-visible:ring-offset-2"
              >
                View and Apply
              </Button>
            </div>
          </Card>

          {/* Student Representatives Card */}
          <Card 
            className="group relative rounded-2xl p-6 md:p-8 bg-[#0c1008] border border-[#015cd2]/30 hover:border-[#015cd2]/60 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-[0_0_30px_rgba(1,92,210,0.3)] cursor-pointer"
            onClick={() => navigate('/hiring/representatives')}
            role="button"
            aria-label="Apply for Student Representative position"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/hiring/representatives');
              }
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#015cd2]/0 via-[#015cd2]/20 to-[#015cd2]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            
            <div className="relative flex flex-col h-full">
              <div className="w-14 h-14 rounded-xl bg-[#015cd2]/20 flex items-center justify-center mb-6 group-hover:bg-[#015cd2]/30 transition-colors">
                <Megaphone className="w-7 h-7 text-[#015cd2]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                Student Representatives
              </h2>
              
              <p className="text-white/70 mb-8 leading-relaxed flex-1">
                Run your school's Frosh account and earn 40% of revenue.
              </p>
              
              <Button 
                className="w-full rounded-2xl px-5 py-6 bg-[#015cd2] hover:bg-[#015cd2]/90 text-white font-semibold transition-all hover:ring-2 hover:ring-[#015cd2] hover:ring-offset-2 hover:ring-offset-[#0c1008] group-hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#015cd2] focus-visible:ring-offset-2"
              >
                View and Apply
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 space-y-3">
          <p className="text-white/60 text-sm">
            Questions or extra materials? <span className="text-white">kian@frosh.app</span>
          </p>
          <p className="text-white/40 text-sm">
            Frosh · Where college begins before campus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HiringHub;
