import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageSquare, Calendar, Shield, Instagram } from "lucide-react";
import heroImage from "@/assets/hero-college-students.jpg";
import { useIsMobile } from "@/hooks/use-mobile";
import { GetFeaturedFlow } from "@/components/GetFeaturedFlow";

const SCHOOL_DATABASE = [
  { name: "University of California, Los Angeles", acronym: "UCLA", searchTerms: ["ucla", "los angeles", "westwood"], slug: "ucla" },
  { name: "Stanford University", acronym: "Stanford", searchTerms: ["stanford", "palo alto"], slug: "stanford" },
  { name: "University of California, Berkeley", acronym: "UC Berkeley", searchTerms: ["berkeley", "cal", "uc berkeley", "ucb"], slug: "uc-berkeley" },
  { name: "University of Southern California", acronym: "USC", searchTerms: ["usc", "southern california", "trojans"], slug: "usc" },
  { name: "Harvard University", acronym: "Harvard", searchTerms: ["harvard", "cambridge"], slug: "harvard" },
  { name: "Arizona State University", acronym: "ASU", searchTerms: ["asu", "arizona state", "tempe"], slug: "asu" },
  { name: "University of California, Santa Barbara", acronym: "UCSB", searchTerms: ["ucsb", "santa barbara", "uc santa barbara"], slug: "ucsb" },
  { name: "New York University", acronym: "NYU", searchTerms: ["nyu", "new york university", "new york"], slug: "nyu" },
  { name: "University of Florida", acronym: "UF", searchTerms: ["uf", "florida", "gainesville", "gators"], slug: "uf" },
  { name: "Texas A&M University", acronym: "Texas A&M", searchTerms: ["texas a&m", "tamu", "college station"], slug: "texas-aandm" },
  { name: "Cornell University", acronym: "Cornell", searchTerms: ["cornell", "ithaca"], slug: "cornell" },
  { name: "Pennsylvania State University", acronym: "Penn State", searchTerms: ["penn state", "psu", "university park"], slug: "penn-state" },
  { name: "Duke University", acronym: "Duke", searchTerms: ["duke", "durham"], slug: "duke" },
  { name: "Florida State University", acronym: "FSU", searchTerms: ["fsu", "florida state", "tallahassee"], slug: "fsu" },
  { name: "University of Pennsylvania", acronym: "UPenn", searchTerms: ["upenn", "penn", "pennsylvania", "philadelphia"], slug: "upenn" },
  { name: "Dartmouth College", acronym: "Dartmouth", searchTerms: ["dartmouth", "hanover"], slug: "dartmouth" },
  { name: "Columbia University", acronym: "Columbia", searchTerms: ["columbia", "new york"], slug: "columbia" },
  { name: "University of California, Irvine", acronym: "UC Irvine", searchTerms: ["uci", "irvine", "uc irvine"], slug: "uc-irvine" },
  { name: "University of Michigan", acronym: "UMich", searchTerms: ["michigan", "ann arbor", "wolverines", "umich"], slug: "umich" },
  { name: "Massachusetts Institute of Technology", acronym: "MIT", searchTerms: ["mit", "massachusetts institute"], slug: "mit" },
  { name: "Northeastern University", acronym: "Northeastern", searchTerms: ["northeastern", "boston"], slug: "northeastern" },
  { name: "University of California, San Diego", acronym: "UCSD", searchTerms: ["ucsd", "san diego", "uc san diego"], slug: "ucsd" },
  { name: "University of Central Florida", acronym: "UCF", searchTerms: ["ucf", "central florida", "orlando"], slug: "ucf" },
  { name: "Princeton University", acronym: "Princeton", searchTerms: ["princeton", "tigers"], slug: "princeton" },
  { name: "Brown University", acronym: "Brown", searchTerms: ["brown", "providence"], slug: "brown" },
  { name: "Yale University", acronym: "Yale", searchTerms: ["yale", "new haven"], slug: "yale" },
  { name: "Georgetown University", acronym: "Georgetown", searchTerms: ["georgetown", "washington dc"], slug: "georgetown" },
  { name: "University of California, Santa Cruz", acronym: "UC Santa Cruz", searchTerms: ["ucsc", "santa cruz", "uc santa cruz"], slug: "uc-santa-cruz" },
  { name: "Carnegie Mellon University", acronym: "CMU", searchTerms: ["cmu", "carnegie mellon", "pittsburgh"], slug: "cmu" },
  { name: "University of Miami", acronym: "UMiami", searchTerms: ["miami", "coral gables"], slug: "umiami" },
  { name: "Northwestern University", acronym: "Northwestern", searchTerms: ["northwestern", "evanston"], slug: "northwestern" },
  { name: "Rice University", acronym: "Rice", searchTerms: ["rice", "houston"], slug: "rice" },
  { name: "Purdue University", acronym: "Purdue", searchTerms: ["purdue", "west lafayette"], slug: "purdue" },
  { name: "University of Chicago", acronym: "UChicago", searchTerms: ["uchicago", "university of chicago", "chicago"], slug: "uchicago" },
  { name: "Vanderbilt University", acronym: "Vanderbilt", searchTerms: ["vanderbilt", "nashville"], slug: "vanderbilt" },
  { name: "Indiana University Bloomington", acronym: "IU Bloomington", searchTerms: ["iu", "indiana university", "bloomington"], slug: "iu-bloomington" },
  { name: "University of Georgia", acronym: "UGA", searchTerms: ["uga", "georgia", "athens"], slug: "uga" },
  { name: "University of Illinois Urbana-Champaign", acronym: "UIUC", searchTerms: ["uiuc", "illinois", "urbana champaign"], slug: "uiuc" },
  { name: "Ohio State University", acronym: "Ohio State", searchTerms: ["osu", "ohio state", "columbus"], slug: "ohio-state" },
  { name: "Michigan State University", acronym: "Michigan State", searchTerms: ["msu", "michigan state", "east lansing"], slug: "michigan-state" },
  { name: "University of Minnesota", acronym: "UMN", searchTerms: ["minnesota", "twin cities", "gophers"], slug: "umn" },
  { name: "University of North Carolina at Chapel Hill", acronym: "UNC Chapel Hill", searchTerms: ["unc", "chapel hill", "north carolina"], slug: "unc" },
  { name: "University of Oregon", acronym: "UOregon", searchTerms: ["oregon", "eugene", "ducks"], slug: "uoregon" },
  { name: "University of Texas at Austin", acronym: "UT Austin", searchTerms: ["ut", "texas", "austin", "longhorns"], slug: "ut-austin" },
  { name: "University of Virginia", acronym: "UVA", searchTerms: ["uva", "virginia", "charlottesville"], slug: "uva" },
  { name: "University of Washington", acronym: "UW", searchTerms: ["uw", "washington", "seattle", "huskies"], slug: "uw" },
  { name: "University of Wisconsin–Madison", acronym: "UW-Madison", searchTerms: ["wisconsin", "madison", "badgers"], slug: "uw-madison" },
  { name: "California Polytechnic State University, San Luis Obispo", acronym: "Cal Poly SLO", searchTerms: ["cal poly", "slo", "san luis obispo", "cal poly slo"], slug: "cal-poly-slo" },
  { name: "California State Polytechnic University, Pomona", acronym: "Cal Poly Pomona", searchTerms: ["cal poly pomona", "cpp", "pomona"], slug: "cal-poly-pomona" },
  { name: "University of California, Davis", acronym: "UC Davis", searchTerms: ["ucd", "davis", "uc davis"], slug: "uc-davis" },
  { name: "University of California, Riverside", acronym: "UC Riverside", searchTerms: ["ucr", "riverside", "uc riverside"], slug: "uc-riverside" },
  { name: "University of California, Merced", acronym: "UC Merced", searchTerms: ["ucm", "merced", "uc merced"], slug: "uc-merced" },
  { name: "California Institute of Technology", acronym: "Caltech", searchTerms: ["caltech", "pasadena", "california institute of technology"], slug: "caltech" },
  { name: "California State University, Sacramento", acronym: "Sac State", searchTerms: ["sac state", "sacramento state", "csus"], slug: "sac-state" },
  { name: "San Diego State University", acronym: "SDSU", searchTerms: ["sdsu", "san diego state"], slug: "sdsu" },
  { name: "San Jose State University", acronym: "SJSU", searchTerms: ["sjsu", "san jose state"], slug: "sjsu" },
  { name: "San Francisco State University", acronym: "SF State", searchTerms: ["sf state", "san francisco state", "sfsu"], slug: "sf-state" },
  { name: "California State University, Chico", acronym: "Chico State", searchTerms: ["chico", "chico state", "csu chico"], slug: "chico-state" },
  { name: "Boston University", acronym: "BU", searchTerms: ["bu", "boston university", "boston"], slug: "bu" },
  { name: "University of Arizona", acronym: "UArizona", searchTerms: ["arizona", "tucson"], slug: "uarizona" },
  { name: "University of Alabama", acronym: "UA", searchTerms: ["alabama", "tuscaloosa", "roll tide"], slug: "ua" },
  { name: "University of Colorado Boulder", acronym: "CU Boulder", searchTerms: ["cu boulder", "colorado boulder", "boulder"], slug: "cu-boulder" },
  { name: "California State University, Long Beach", acronym: "CSULB", searchTerms: ["csulb", "long beach", "cal state long beach"], slug: "csulb" },
  { name: "Virginia Polytechnic Institute and State University", acronym: "Virginia Tech", searchTerms: ["virginia tech", "vt", "blacksburg"], slug: "virginia-tech" }
];

// Smart search function that handles acronyms, nicknames, and partial matches
const searchSchools = (query: string) => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const results = [];
  
  // First pass: Exact matches (highest priority)
  for (const school of SCHOOL_DATABASE) {
    for (const keyword of school.searchTerms) {
      if (keyword.toLowerCase() === searchTerm) {
        results.push({ school, score: 100, matchType: 'exact' });
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
          results.push({ school, score: 75, matchType: 'startsWith' });
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
          results.push({ school, score: 50, matchType: 'contains' });
          break;
        }
      }
    }
  }
  
  // Sort by score (highest first) and return top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(r => r.school);
};

const Homepage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGetFeaturedModal, setShowGetFeaturedModal] = useState(false);

  const handleSchoolSelect = (schoolName: string, schoolSlug?: string) => {
    const slug = schoolSlug || schoolName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/${slug}`);
  };

  const handleGetFeaturedClick = () => {
    console.log("Get Featured button clicked!");
    setShowGetFeaturedModal(true);
  };

  const filteredSchools = searchSchools(searchTerm);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src={isMobile ? "/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png" : "/lovable-uploads/e9020b20-5a8d-4a80-a4e0-9d917c7c5e5c.png"}
                alt="FroshMeet Logo" 
                className={isMobile ? "h-10 w-auto" : "h-16 w-auto"}
              />
            </div>
            
            {/* Centered Navigation */}
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
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/signin')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')} className="bg-primary hover:bg-primary/90">
                Join FroshMeet Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
                🎓 Meet Your College Crew Before Day One
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Connect with your{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  college community
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                FroshMeet helps you find roommates, group chats, and new friends at your school, before the year even starts.
              </p>
              <p className="text-lg text-primary font-semibold mb-8 max-w-lg">
                🚀 Join early, stand out, and get featured on your school's Instagram. Now live for Class of 2030 at 85+ colleges across the U.S & Canada.
              </p>
              
              {/* School Search */}
              <div className="max-w-md mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for your school..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-14 pl-10 text-lg bg-card/50 border-border/40"
                  />
                   {searchTerm && filteredSchools.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-50 max-h-60 overflow-y-auto shadow-2xl animate-fade-scale-in">
                      {filteredSchools.slice(0, 5).map((school) => (
                        <div
                          key={school.name}
                          className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/40 last:border-b-0 transition-colors"
                          onClick={() => {
                            setSearchTerm("");
                            handleSchoolSelect(school.name, school.slug);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-bold text-primary">{school.acronym}</div>
                            <div className="text-sm text-foreground">{school.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    onClick={() => searchTerm && filteredSchools.length > 0 && handleSchoolSelect(filteredSchools[0].name, filteredSchools[0].slug)}
                    disabled={!searchTerm || filteredSchools.length === 0}
                    className="flex-1 h-12 text-base bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Explore {searchTerm && filteredSchools.length > 0 ? filteredSchools[0].name : "School"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/community')}
                    className="h-12 px-6"
                  >
                    Browse Schools
                  </Button>
                </div>
                
                {/* Get Featured Promotion */}
                <div className="mt-8 p-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 rounded-2xl border border-gradient-to-r border-pink-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Get Featured on Instagram</h3>
                      <p className="text-sm text-muted-foreground">Share your story with thousands of students</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGetFeaturedClick}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white border-0 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Start Your Feature Application
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                ⚠️ FroshMeet is a student-run platform and is not officially affiliated with or endorsed by any college or university.
              </p>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3"></div>
              <img 
                src="/lovable-uploads/f95a4d92-a40d-46a3-9199-c970d7098828.png"
                alt="College students connecting and making friends" 
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

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
          
          <div className="relative space-y-6">
            {/* Top Row */}
            <div className="overflow-hidden">
              <div className="flex animate-scroll-carousel space-x-6">
                {/* Render schools twice for seamless loop */}
                {[...SCHOOL_DATABASE, ...SCHOOL_DATABASE].map((school, index) => (
                  <Button
                    key={`top-${school.name}-${index}`}
                    variant="outline"
                    onClick={() => handleSchoolSelect(school.name, school.slug)}
                    className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 transition-all duration-500 hover:scale-105 bg-card/40 border-border/40 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary/40 to-primary/70 rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
                      <span className="text-primary-foreground font-bold text-base md:text-lg">
                        {school.name.charAt(0)}
                      </span>
                    </div>
                    <span className="relative z-10 text-center leading-tight font-semibold px-2">{school.acronym}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Bottom Row - Offset */}
            <div className="overflow-hidden">
              <div className="flex animate-scroll-carousel space-x-6" style={{ marginLeft: '5rem' }}>
                {/* Render schools twice for seamless loop, starting from a different index for variety */}
                {[...SCHOOL_DATABASE.slice(10), ...SCHOOL_DATABASE, ...SCHOOL_DATABASE.slice(0, 10)].map((school, index) => (
                  <Button
                    key={`bottom-${school.name}-${index}`}
                    variant="outline"
                    onClick={() => handleSchoolSelect(school.name, school.slug)}
                    className="flex-shrink-0 w-40 md:w-48 h-28 md:h-32 flex flex-col items-center justify-center text-sm md:text-base hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:border-primary/60 transition-all duration-500 hover:scale-105 bg-card/40 border-border/40 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary/40 to-primary/70 rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
                      <span className="text-primary-foreground font-bold text-base md:text-lg">
                        {school.name.charAt(0)}
                      </span>
                    </div>
                    <span className="relative z-10 text-center leading-tight font-semibold px-2">{school.acronym}</span>
                  </Button>
                ))}
              </div>
            </div>
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
            
            <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.1s' }}>
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
            
            <Card className="bg-card/50 border-border/40 hover:bg-card/80 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.2s' }}>
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
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white hover:from-pink-600 hover:to-purple-600"
                onClick={() => window.open('https://instagram.com/froshmeet', '_blank')}
              >
                <Instagram className="h-5 w-5 mr-2" />
                Follow @FroshMeet
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram-Style Get Featured Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500 via-pink-500 via-orange-500 to-yellow-500 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              {/* Instagram Icon */}
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Heading */}
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to Get Featured?
              </h2>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join thousands of students showcasing their personalities and getting featured on their school's Instagram
              </p>
              
              {/* CTA Button */}
              <div className="relative z-20">
                <Button
                  onClick={handleGetFeaturedClick}
                  className="bg-white text-purple-600 hover:bg-white/90 h-16 px-8 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 group relative z-30 pointer-events-auto"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✨</span>
                  </div>
                  Get Featured Now
                  <div className="ml-3 w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <span className="text-white text-sm">→</span>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Right Image Placeholder */}
            <div className="flex-1 lg:max-w-md animate-slide-in-right">
              <div className="relative">
                {/* Glowing border effect with Instagram gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 via-orange-400 to-yellow-400 rounded-3xl blur-xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-1">
                  <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-2xl h-96 flex items-center justify-center text-white/60">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-white/80" />
                      </div>
                      <p className="text-lg font-medium">Example Student Profile</p>
                      <p className="text-sm text-white/60 mt-2">Showcase your personality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration with Instagram gradient colors */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/30 rounded-full"></div>
        </div>
      </section>

      {/* Dark Footer with Navigation */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">FroshMeet</h3>
              <p className="text-gray-400">Connecting the Class of 2030, one friendship at a time</p>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/about')} 
                className="text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300"
              >
                About
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/features')} 
                className="text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300"
              >
                How It Works
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300"
              >
                FAQs
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/contact')} 
                className="text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:bg-clip-text hover:text-transparent transition-all duration-300"
              >
                Contact
              </Button>
            </nav>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png"
                  alt="FroshMeet Logo" 
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-foreground">FroshMeet</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                The trusted platform for college freshmen to connect, network, and build lasting friendships 
                before stepping foot on campus.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
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
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Privacy Policy
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Terms of Service
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground w-full justify-start p-0 h-auto">
                  Cookie Policy
                </Button>
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

      {/* Get Featured Flow */}
      <GetFeaturedFlow 
        open={showGetFeaturedModal} 
        onOpenChange={setShowGetFeaturedModal} 
      />
    </div>
  );
};

export default Homepage;
