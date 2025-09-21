import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageSquare, Calendar, Shield, Instagram, Menu, X } from "lucide-react";
import heroImage from "@/assets/hero-college-students.jpg";
import { useIsMobile } from "@/hooks/use-mobile";
import { GetFeaturedFlow } from "@/components/GetFeaturedFlow";
import Hero from "@/components/landing/Hero";
import GetFeaturedPromo from "@/components/marketing/GetFeaturedPromo";
import { SwipeableSchoolCarousel } from "@/components/SwipeableSchoolCarousel";
const SCHOOL_DATABASE = [{
  name: "University of California, Los Angeles",
  acronym: "UCLA",
  searchTerms: ["ucla", "los angeles", "westwood"],
  slug: "ucla"
}, {
  name: "Stanford University",
  acronym: "Stanford",
  searchTerms: ["stanford", "palo alto"],
  slug: "stanford"
}, {
  name: "University of California, Berkeley",
  acronym: "UC Berkeley",
  searchTerms: ["berkeley", "cal", "uc berkeley", "ucb"],
  slug: "uc-berkeley"
}, {
  name: "University of Southern California",
  acronym: "USC",
  searchTerms: ["usc", "southern california", "trojans"],
  slug: "usc"
}, {
  name: "Harvard University",
  acronym: "Harvard",
  searchTerms: ["harvard", "cambridge"],
  slug: "harvard"
}, {
  name: "Arizona State University",
  acronym: "ASU",
  searchTerms: ["asu", "arizona state", "tempe"],
  slug: "asu"
}, {
  name: "University of California, Santa Barbara",
  acronym: "UCSB",
  searchTerms: ["ucsb", "santa barbara", "uc santa barbara"],
  slug: "ucsb"
}, {
  name: "New York University",
  acronym: "NYU",
  searchTerms: ["nyu", "new york university", "new york"],
  slug: "nyu"
}, {
  name: "University of Florida",
  acronym: "UF",
  searchTerms: ["uf", "florida", "gainesville", "gators"],
  slug: "uf"
}, {
  name: "Texas A&M University",
  acronym: "Texas A&M",
  searchTerms: ["texas a&m", "tamu", "college station"],
  slug: "texas-aandm"
}, {
  name: "Cornell University",
  acronym: "Cornell",
  searchTerms: ["cornell", "ithaca"],
  slug: "cornell"
}, {
  name: "Pennsylvania State University",
  acronym: "Penn State",
  searchTerms: ["penn state", "psu", "university park"],
  slug: "penn-state"
}, {
  name: "Duke University",
  acronym: "Duke",
  searchTerms: ["duke", "durham"],
  slug: "duke"
}, {
  name: "Florida State University",
  acronym: "FSU",
  searchTerms: ["fsu", "florida state", "tallahassee"],
  slug: "fsu"
}, {
  name: "University of Pennsylvania",
  acronym: "UPenn",
  searchTerms: ["upenn", "penn", "pennsylvania", "philadelphia"],
  slug: "upenn"
}, {
  name: "Dartmouth College",
  acronym: "Dartmouth",
  searchTerms: ["dartmouth", "hanover"],
  slug: "dartmouth"
}, {
  name: "Columbia University",
  acronym: "Columbia",
  searchTerms: ["columbia", "new york"],
  slug: "columbia"
}, {
  name: "University of California, Irvine",
  acronym: "UC Irvine",
  searchTerms: ["uci", "irvine", "uc irvine"],
  slug: "uc-irvine"
}, {
  name: "University of Michigan",
  acronym: "UMich",
  searchTerms: ["michigan", "ann arbor", "wolverines", "umich"],
  slug: "umich"
}, {
  name: "Massachusetts Institute of Technology",
  acronym: "MIT",
  searchTerms: ["mit", "massachusetts institute"],
  slug: "mit"
}, {
  name: "Northeastern University",
  acronym: "Northeastern",
  searchTerms: ["northeastern", "boston"],
  slug: "northeastern"
}, {
  name: "University of California, San Diego",
  acronym: "UCSD",
  searchTerms: ["ucsd", "san diego", "uc san diego"],
  slug: "ucsd"
}, {
  name: "University of Central Florida",
  acronym: "UCF",
  searchTerms: ["ucf", "central florida", "orlando"],
  slug: "ucf"
}, {
  name: "Princeton University",
  acronym: "Princeton",
  searchTerms: ["princeton", "tigers"],
  slug: "princeton"
}, {
  name: "Brown University",
  acronym: "Brown",
  searchTerms: ["brown", "providence"],
  slug: "brown"
}, {
  name: "Yale University",
  acronym: "Yale",
  searchTerms: ["yale", "new haven"],
  slug: "yale"
}, {
  name: "Georgetown University",
  acronym: "Georgetown",
  searchTerms: ["georgetown", "washington dc"],
  slug: "georgetown"
}, {
  name: "University of California, Santa Cruz",
  acronym: "UC Santa Cruz",
  searchTerms: ["ucsc", "santa cruz", "uc santa cruz"],
  slug: "uc-santa-cruz"
}, {
  name: "Carnegie Mellon University",
  acronym: "CMU",
  searchTerms: ["cmu", "carnegie mellon", "pittsburgh"],
  slug: "cmu"
}, {
  name: "University of Miami",
  acronym: "UMiami",
  searchTerms: ["miami", "coral gables"],
  slug: "umiami"
}, {
  name: "Northwestern University",
  acronym: "Northwestern",
  searchTerms: ["northwestern", "evanston"],
  slug: "northwestern"
}, {
  name: "Rice University",
  acronym: "Rice",
  searchTerms: ["rice", "houston"],
  slug: "rice"
}, {
  name: "Purdue University",
  acronym: "Purdue",
  searchTerms: ["purdue", "west lafayette"],
  slug: "purdue"
}, {
  name: "University of Chicago",
  acronym: "UChicago",
  searchTerms: ["uchicago", "university of chicago", "chicago"],
  slug: "uchicago"
}, {
  name: "Vanderbilt University",
  acronym: "Vanderbilt",
  searchTerms: ["vanderbilt", "nashville"],
  slug: "vanderbilt"
}, {
  name: "Indiana University Bloomington",
  acronym: "IU Bloomington",
  searchTerms: ["iu", "indiana university", "bloomington"],
  slug: "iu-bloomington"
}, {
  name: "University of Georgia",
  acronym: "UGA",
  searchTerms: ["uga", "georgia", "athens"],
  slug: "uga"
}, {
  name: "University of Illinois Urbana-Champaign",
  acronym: "UIUC",
  searchTerms: ["uiuc", "illinois", "urbana champaign"],
  slug: "uiuc"
}, {
  name: "Ohio State University",
  acronym: "Ohio State",
  searchTerms: ["osu", "ohio state", "columbus"],
  slug: "ohio-state"
}, {
  name: "Michigan State University",
  acronym: "Michigan State",
  searchTerms: ["msu", "michigan state", "east lansing"],
  slug: "michigan-state"
}, {
  name: "University of Minnesota",
  acronym: "UMN",
  searchTerms: ["minnesota", "twin cities", "gophers"],
  slug: "umn"
}, {
  name: "University of North Carolina at Chapel Hill",
  acronym: "UNC Chapel Hill",
  searchTerms: ["unc", "chapel hill", "north carolina"],
  slug: "unc"
}, {
  name: "University of Oregon",
  acronym: "UOregon",
  searchTerms: ["oregon", "eugene", "ducks"],
  slug: "uoregon"
}, {
  name: "University of Texas at Austin",
  acronym: "UT Austin",
  searchTerms: ["ut", "texas", "austin", "longhorns"],
  slug: "ut-austin"
}, {
  name: "University of Virginia",
  acronym: "UVA",
  searchTerms: ["uva", "virginia", "charlottesville"],
  slug: "uva"
}, {
  name: "University of Washington",
  acronym: "UW",
  searchTerms: ["uw", "washington", "seattle", "huskies"],
  slug: "uw"
}, {
  name: "University of Wisconsin–Madison",
  acronym: "UW-Madison",
  searchTerms: ["wisconsin", "madison", "badgers"],
  slug: "uw-madison"
}, {
  name: "California Polytechnic State University, San Luis Obispo",
  acronym: "Cal Poly SLO",
  searchTerms: ["cal poly", "slo", "san luis obispo", "cal poly slo"],
  slug: "cal-poly-slo"
}, {
  name: "California State Polytechnic University, Pomona",
  acronym: "Cal Poly Pomona",
  searchTerms: ["cal poly pomona", "cpp", "pomona"],
  slug: "cal-poly-pomona"
}, {
  name: "University of California, Davis",
  acronym: "UC Davis",
  searchTerms: ["ucd", "davis", "uc davis"],
  slug: "uc-davis"
}, {
  name: "University of California, Riverside",
  acronym: "UC Riverside",
  searchTerms: ["ucr", "riverside", "uc riverside"],
  slug: "uc-riverside"
}, {
  name: "University of California, Merced",
  acronym: "UC Merced",
  searchTerms: ["ucm", "merced", "uc merced"],
  slug: "uc-merced"
}, {
  name: "California Institute of Technology",
  acronym: "Caltech",
  searchTerms: ["caltech", "pasadena", "california institute of technology"],
  slug: "caltech"
}, {
  name: "California State University, Sacramento",
  acronym: "Sac State",
  searchTerms: ["sac state", "sacramento state", "csus"],
  slug: "sac-state"
}, {
  name: "San Diego State University",
  acronym: "SDSU",
  searchTerms: ["sdsu", "san diego state"],
  slug: "sdsu"
}, {
  name: "San Jose State University",
  acronym: "SJSU",
  searchTerms: ["sjsu", "san jose state"],
  slug: "sjsu"
}, {
  name: "San Francisco State University",
  acronym: "SF State",
  searchTerms: ["sf state", "san francisco state", "sfsu"],
  slug: "sf-state"
}, {
  name: "California State University, Chico",
  acronym: "Chico State",
  searchTerms: ["chico", "chico state", "csu chico"],
  slug: "chico-state"
}, {
  name: "Boston University",
  acronym: "BU",
  searchTerms: ["bu", "boston university", "boston"],
  slug: "bu"
}, {
  name: "University of Arizona",
  acronym: "UArizona",
  searchTerms: ["arizona", "tucson"],
  slug: "uarizona"
}, {
  name: "University of Alabama",
  acronym: "UA",
  searchTerms: ["alabama", "tuscaloosa", "roll tide"],
  slug: "ua"
}, {
  name: "University of Colorado Boulder",
  acronym: "CU Boulder",
  searchTerms: ["cu boulder", "colorado boulder", "boulder"],
  slug: "cu-boulder"
}, {
  name: "California State University, Long Beach",
  acronym: "CSULB",
  searchTerms: ["csulb", "long beach", "cal state long beach"],
  slug: "csulb"
}, {
  name: "Virginia Polytechnic Institute and State University",
  acronym: "Virginia Tech",
  searchTerms: ["virginia tech", "vt", "blacksburg"],
  slug: "virginia-tech"
}];

// Smart search function that handles acronyms, nicknames, and partial matches
const searchSchools = (query: string) => {
  if (!query.trim()) return [];
  const searchTerm = query.toLowerCase().trim();
  const results = [];

  // First pass: Exact matches (highest priority)
  for (const school of SCHOOL_DATABASE) {
    for (const keyword of school.searchTerms) {
      if (keyword.toLowerCase() === searchTerm) {
        results.push({
          school,
          score: 100,
          matchType: 'exact'
        });
        break;
      }
    }
  }

  // Second pass: Starts with matches
  if (results.length < 10) {
    for (const school of SCHOOL_DATABASE) {
      // Skip if already found in exact matches
      if (results.some(r => r.school.name === school.name)) continue;
      for (const keyword of school.searchTerms) {
        if (keyword.toLowerCase().startsWith(searchTerm)) {
          results.push({
            school,
            score: 75,
            matchType: 'startsWith'
          });
          break;
        }
      }
    }
  }

  // Third pass: Contains matches (lowest priority)
  if (results.length < 10) {
    for (const school of SCHOOL_DATABASE) {
      // Skip if already found
      if (results.some(r => r.school.name === school.name)) continue;
      for (const keyword of school.searchTerms) {
        if (keyword.toLowerCase().includes(searchTerm)) {
          results.push({
            school,
            score: 50,
            matchType: 'contains'
          });
          break;
        }
      }
    }
  }

  // Sort by score (highest first) and return top 10
  return results.sort((a, b) => b.score - a.score).slice(0, 10).map(r => r.school);
};
const Homepage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGetFeaturedModal, setShowGetFeaturedModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleSchoolSelect = (schoolName: string, schoolSlug?: string) => {
    const slug = schoolSlug || schoolName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/${slug}`);
  };
  const handleGetFeaturedClick = () => {
    console.log("Get Featured button clicked!");
    setShowGetFeaturedModal(true);
  };
  const filteredSchools = searchSchools(searchTerm);
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <img src="/lovable-uploads/fresh_meat_app_icon-4.png" alt="FroshMeet Logo" className={isMobile ? "h-10 w-auto" : "h-16 w-auto"} />
            </div>
            
            {/* Centered Navigation - Desktop Only */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Button variant="ghost" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground">
                  Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/community')} className="text-muted-foreground hover:text-foreground">
                  Community
                </Button>
                <Button variant="ghost" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground">
                  Contact
                </Button>
                <Button variant="ghost" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">
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
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/features');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left justify-start text-lg py-4 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
                >
                  Features
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/community');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left justify-start text-lg py-4 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
                >
                  Community
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left justify-start text-lg py-4 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
                >
                  Contact
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left justify-start text-lg py-4 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
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

      {/* Hero Section */}
      <Hero />

      {/* Get Featured Promo */}
      <GetFeaturedPromo onOpen={handleGetFeaturedClick} />

      {/* Popular Schools Carousel */}
      <section className="py-20 bg-card/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Popular Schools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join students from these top universities already connecting on FroshMeet
            </p>
          </div>
          
          <div className="relative">
            <SwipeableSchoolCarousel 
              schools={SCHOOL_DATABASE}
              onSchoolSelect={handleSchoolSelect}
            />
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need to connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make FroshMeet the perfect platform for college freshmen
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Find Your People</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with roommates, study buddies, and friends who share your interests and goals
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{
            animationDelay: '0.1s'
          }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Safe Messaging</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chat securely with verified students from your school in a safe, moderated environment
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{
            animationDelay: '0.2s'
          }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Campus Events</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover events, study groups, and activities happening at your school
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram Feed Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              See what's happening
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow @FroshMeet on Instagram for student stories, tips, and community highlights
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border/40 p-8 text-center">
              <Instagram className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">@FroshMeet Instagram Feed</h3>
              <p className="text-muted-foreground mb-6">
                Connect with us on Instagram to see real student stories and stay updated with the latest from the FroshMeet community
              </p>
              <Button variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white hover:from-pink-600 hover:to-purple-600" onClick={() => window.open('https://instagram.com/froshmeet', '_blank')}>
                <Instagram className="h-5 w-5 mr-2" />
                Follow @FroshMeet
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram-Style Get Featured Section */}
      

      {/* Dark Footer with Navigation */}
      


      {/* Get Featured Flow */}
      <GetFeaturedFlow open={showGetFeaturedModal} onOpenChange={setShowGetFeaturedModal} />
    </div>;
};
export default Homepage;