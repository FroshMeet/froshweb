import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [selectedSchool, setSelectedSchool] = useState("");

  const handleSchoolSelect = (schoolName: string, schoolSlug?: string) => {
    const slug = schoolSlug || schoolName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/${slug}`);
  };

  const filteredSchools = searchSchools(searchTerm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
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
            <Button variant="outline" onClick={() => navigate('/app')}>
              Open App
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Connect with your <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              college community
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find roommates, study buddies, and lifelong friends at your school. 
            Join thousands of students already connecting on FroshMeet.
          </p>

          {/* School Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search for your school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-lg"
                />
                 {searchTerm && filteredSchools.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md mt-1 z-50 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSchools.map((school) => (
                      <div
                        key={school.name}
                        className="p-3 hover:bg-muted cursor-pointer text-sm border-b border-border last:border-b-0"
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

              <Button 
                onClick={() => searchTerm && filteredSchools.length > 0 && handleSchoolSelect(filteredSchools[0].name, filteredSchools[0].slug)}
                disabled={!searchTerm || filteredSchools.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                Explore {searchTerm && filteredSchools.length > 0 ? filteredSchools[0].name : "School"} Community
              </Button>
            </div>
          </div>

          {/* Featured Schools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {SCHOOL_DATABASE.slice(0, 8).map((school) => (
              <Button
                key={school.name}
                variant="outline"
                onClick={() => handleSchoolSelect(school.name, school.slug)}
                className="h-20 flex flex-col items-center justify-center text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-semibold text-xs">
                    {school.name.charAt(0)}
                  </span>
                </div>
                {school.name}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 FroshMeet. Connecting college communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;