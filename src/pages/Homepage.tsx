import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, MessageSquare, Calendar, Shield, Instagram } from "lucide-react";
import heroImage from "@/assets/hero-college-students.jpg";

const SCHOOL_DATABASE = [
  {
    name: "UC Santa Cruz",
    slug: "uc-santa-cruz",
    keywords: ["UCSC", "Santa Cruz", "UC Santa Cruz"]
  },
  {
    name: "UC Berkeley",
    slug: "uc-berkeley",
    keywords: ["UC Berkeley", "Berkeley", "Cal", "California"]
  },
  {
    name: "Harvard University",
    slug: "harvard-university",
    keywords: ["Harvard", "Harvard University"]
  },
  {
    name: "USC",
    slug: "usc",
    keywords: ["USC", "Southern California", "University of Southern California"]
  },
  {
    name: "NYU",
    slug: "nyu",
    keywords: ["NYU", "New York University"]
  },
  {
    name: "Stanford University",
    slug: "stanford-university",
    keywords: ["Stanford", "Stanford University"]
  },
  {
    name: "Florida State University",
    slug: "florida-state-university",
    keywords: ["FSU", "Florida State", "Florida State University"]
  },
  {
    name: "UCLA",
    slug: "ucla",
    keywords: ["UCLA", "California Los Angeles", "UC Los Angeles"]
  },
  {
    name: "MIT",
    slug: "mit",
    keywords: ["MIT", "Massachusetts Institute of Technology"]
  },
  {
    name: "UPenn",
    slug: "upenn",
    keywords: ["UPenn", "University of Pennsylvania", "Penn"]
  },
  {
    name: "Princeton University",
    slug: "princeton-university",
    keywords: ["Princeton", "Princeton University"]
  },
  {
    name: "ASU",
    slug: "asu",
    keywords: ["ASU", "Arizona State", "Arizona State University"]
  },
  {
    name: "Caltech",
    slug: "caltech",
    keywords: ["Caltech", "California Institute of Technology"]
  },
  {
    name: "University of Chicago",
    slug: "university-of-chicago",
    keywords: ["University of Chicago", "UChicago", "Chicago"]
  },
  {
    name: "Columbia University",
    slug: "columbia-university",
    keywords: ["Columbia", "Columbia University"]
  },
  {
    name: "Yale University",
    slug: "yale-university",
    keywords: ["Yale", "Yale University"]
  },
  {
    name: "UC San Diego",
    slug: "uc-san-diego",
    keywords: ["UCSD", "San Diego", "UC San Diego"]
  },
  {
    name: "UC Irvine",
    slug: "uc-irvine",
    keywords: ["UCI", "UC Irvine", "Irvine"]
  },
  {
    name: "University of Florida",
    slug: "university-of-florida",
    keywords: ["University of Florida", "UF", "Florida"]
  },
  {
    name: "UC Davis",
    slug: "uc-davis",
    keywords: ["UC Davis", "Davis"]
  },
  {
    name: "University of Texas",
    slug: "university-of-texas",
    keywords: ["University of Texas", "UT", "Texas"]
  },
  {
    name: "UC Santa Barbara",
    slug: "uc-santa-barbara",
    keywords: ["UCSB", "Santa Barbara", "UC Santa Barbara"]
  },
  {
    name: "Duke University",
    slug: "duke-university",
    keywords: ["Duke", "Duke University"]
  },
  {
    name: "UC Merced",
    slug: "uc-merced",
    keywords: ["UC Merced", "Merced"]
  },
  {
    name: "University of Michigan",
    slug: "university-of-michigan",
    keywords: ["University of Michigan", "Michigan"]
  },
  {
    name: "UNC Chapel Hill",
    slug: "unc-chapel-hill",
    keywords: ["UNC", "UNC Chapel Hill", "Chapel Hill"]
  },
  {
    name: "University of Virginia",
    slug: "university-of-virginia",
    keywords: ["University of Virginia", "UVA", "Virginia"]
  },
  {
    name: "University of Washington",
    slug: "university-of-washington",
    keywords: ["University of Washington", "UW", "Washington"]
  },
  {
    name: "Brown University",
    slug: "brown-university",
    keywords: ["Brown", "Brown University"]
  },
  {
    name: "Northwestern University",
    slug: "northwestern-university",
    keywords: ["Northwestern", "Northwestern University"]
  },
  {
    name: "Vanderbilt University",
    slug: "vanderbilt-university",
    keywords: ["Vanderbilt", "Vanderbilt University"]
  },
  {
    name: "Dartmouth College",
    slug: "dartmouth-college",
    keywords: ["Dartmouth", "Dartmouth College"]
  },
  {
    name: "Georgetown University",
    slug: "georgetown-university",
    keywords: ["Georgetown", "Georgetown University"]
  },
  {
    name: "Rice University",
    slug: "rice-university",
    keywords: ["Rice", "Rice University"]
  },
  {
    name: "University of Miami",
    slug: "university-of-miami",
    keywords: ["University of Miami", "Miami"]
  },
  {
    name: "Carnegie Mellon University",
    slug: "carnegie-mellon-university",
    keywords: ["Carnegie Mellon", "CMU", "Carnegie Mellon University"]
  },
  {
    name: "Boston University",
    slug: "boston-university",
    keywords: ["Boston University", "BU"]
  },
  {
    name: "Purdue University",
    slug: "purdue-university",
    keywords: ["Purdue", "Purdue University"]
  },
  {
    name: "University of Georgia",
    slug: "university-of-georgia",
    keywords: ["University of Georgia", "UGA", "Georgia"]
  },
  {
    name: "Indiana University",
    slug: "indiana-university",
    keywords: ["Indiana University", "IU", "Bloomington"]
  },
  {
    name: "Penn State",
    slug: "penn-state",
    keywords: ["Penn State", "PSU", "Pennsylvania State"]
  },
  {
    name: "Michigan State University",
    slug: "michigan-state-university",
    keywords: ["Michigan State", "MSU", "Michigan State University"]
  },
  {
    name: "Ohio State University",
    slug: "ohio-state-university",
    keywords: ["Ohio State", "OSU", "Ohio State University"]
  },
  {
    name: "University of Arizona",
    slug: "university-of-arizona",
    keywords: ["University of Arizona", "Arizona"]
  },
  {
    name: "Texas A&M University",
    slug: "texas-aandm-university",
    keywords: ["Texas A&M", "TAMU", "Texas A&M University"]
  },
  {
    name: "Virginia Tech",
    slug: "virginia-tech",
    keywords: ["Virginia Tech", "VT"]
  },
  {
    name: "University of Minnesota",
    slug: "university-of-minnesota",
    keywords: ["University of Minnesota", "Minnesota"]
  },
  {
    name: "University of Oregon",
    slug: "university-of-oregon",
    keywords: ["University of Oregon", "Oregon"]
  },
  {
    name: "Northeastern University",
    slug: "northeastern-university",
    keywords: ["Northeastern", "Northeastern University"]
  },
  {
    name: "University of Alabama",
    slug: "university-of-alabama",
    keywords: ["University of Alabama", "Alabama"]
  },
  {
    name: "Sac State",
    slug: "sac-state",
    keywords: ["Sac State", "California State University Sacramento"]
  },
  {
    name: "SF State",
    slug: "sf-state",
    keywords: ["SF State", "San Francisco State University"]
  },
  {
    name: "CSULB",
    slug: "csulb",
    keywords: ["CSULB", "Cal State Long Beach", "California State University Long Beach"]
  },
  {
    name: "Cal Poly Pomona",
    slug: "cal-poly-pomona",
    keywords: ["Cal Poly Pomona", "CPP", "California State Polytechnic University Pomona"]
  },
  {
    name: "SDSU",
    slug: "sdsu",
    keywords: ["SDSU", "San Diego State University"]
  },
  {
    name: "SJSU",
    slug: "sjsu",
    keywords: ["SJSU", "San Jose State University"]
  },
  {
    name: "Chico State",
    slug: "chico-state",
    keywords: ["Chico State", "California State University Chico"]
  },
  {
    name: "Cal Poly SLO",
    slug: "cal-poly-slo",
    keywords: ["Cal Poly San Luis Obispo", "Cal Poly SLO", "California Polytechnic State University"]
  },
  {
    name: "UCF",
    slug: "ucf",
    keywords: ["UCF", "University of Central Florida", "Central Florida"]
  },
  {
    name: "Cornell University",
    slug: "cornell-university",
    keywords: ["Cornell", "Cornell University"]
  },
  {
    name: "University of Colorado Boulder",
    slug: "university-of-colorado-boulder",
    keywords: ["CU Boulder", "University of Colorado", "Colorado Boulder"]
  },
  {
    name: "University of Wisconsin",
    slug: "university-of-wisconsin",
    keywords: ["UW Madison", "University of Wisconsin", "Wisconsin Madison"]
  },
  {
    name: "UIUC",
    slug: "uiuc",
    keywords: ["UIUC", "University of Illinois", "Illinois Urbana Champaign"]
  }
];

// Smart search function that handles acronyms, nicknames, and partial matches
const searchSchools = (query: string) => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const results = [];
  
  // First pass: Exact matches (highest priority)
  for (const school of SCHOOL_DATABASE) {
    for (const keyword of school.keywords) {
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
      
      for (const keyword of school.keywords) {
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
      
      for (const keyword of school.keywords) {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");

  const handleSchoolSelect = (schoolName: string, schoolSlug?: string) => {
    const slug = schoolSlug || schoolName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/${slug}`);
  };

  const filteredSchools = searchSchools(searchTerm);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                alt="FroshMeet Logo" 
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">
                About
              </Button>
              <Button variant="ghost" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground">
                Features
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground">
                Contact
              </Button>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/app')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/app')} className="bg-primary hover:bg-primary/90">
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
                Find roommates, study buddies, and lifelong friends at your school. 
                Join thousands of students already connecting on FroshMeet - the trusted platform 
                for college freshmen to build meaningful relationships.
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
                    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-50 max-h-60 overflow-y-auto shadow-2xl">
                      {filteredSchools.slice(0, 5).map((school) => (
                        <div
                          key={school.name}
                          className="p-4 hover:bg-muted/50 cursor-pointer text-sm border-b border-border/40 last:border-b-0 transition-colors"
                          onClick={() => {
                            setSearchTerm("");
                            handleSchoolSelect(school.name, school.slug);
                          }}
                        >
                          {school.name}
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
                    onClick={() => navigate('/features')}
                    className="h-12 px-6"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                ⚠️ FroshMeet is an independent platform and is not officially partnered with any university.
              </p>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3"></div>
              <img 
                src={heroImage}
                alt="College students connecting and making friends" 
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
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

      {/* Featured Schools Grid */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Popular Schools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join students from these top universities already connecting on FroshMeet
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {SCHOOL_DATABASE.slice(0, 12).map((school, index) => (
              <Button
                key={school.name}
                variant="outline"
                onClick={() => handleSchoolSelect(school.name, school.slug)}
                className="h-24 flex flex-col items-center justify-center text-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 bg-card/30 border-border/40 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary/30 to-primary/60 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-bold text-xs">
                    {school.name.charAt(0)}
                  </span>
                </div>
                <span className="text-center leading-tight">{school.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 animate-fade-in">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get the latest updates, tips, and stories from the FroshMeet community
              </p>
              <form onSubmit={handleNewsletterSignup} className="flex gap-4 max-w-md mx-auto">
                <Input
                  type="email"  
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-background/50"
                  required
                />
                <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                  alt="FroshMeet Logo" 
                  className="h-8 w-auto"
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
              FroshMeet is not officially partnered with any university. 
              <br className="md:hidden" />
              Use of this website constitutes acceptance of our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;