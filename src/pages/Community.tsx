import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft } from "lucide-react";

const SCHOOLS = [
  { name: "Arizona State University", acronym: "ASU", slug: "asu", searchTerms: ["ASU", "Arizona State University", "Arizona State", "Arizona"] },
  { name: "Boston University", acronym: "BU", slug: "bu", searchTerms: ["BU", "Boston University", "Boston"] },
  { name: "Brown University", acronym: "Brown", slug: "brown", searchTerms: ["Brown", "Brown University"] },
  { name: "California State Polytechnic University, Pomona", acronym: "Cal Poly Pomona", slug: "cal-poly-pomona", searchTerms: ["Cal Poly Pomona", "California State Polytechnic University Pomona", "Pomona", "Cal Poly"] },
  { name: "California Institute of Technology", acronym: "Caltech", slug: "caltech", searchTerms: ["Caltech", "California Institute of Technology", "California Institute"] },
  { name: "California Polytechnic State University, San Luis Obispo", acronym: "Cal Poly SLO", slug: "cal-poly-slo", searchTerms: ["Cal Poly SLO", "California Polytechnic State University San Luis Obispo", "Cal Poly", "SLO"] },
  { name: "California State University, Long Beach", acronym: "CSULB", slug: "csulb", searchTerms: ["CSULB", "California State University Long Beach", "Long Beach", "Cal State Long Beach"] },
  { name: "Carnegie Mellon University", acronym: "CMU", slug: "cmu", searchTerms: ["CMU", "Carnegie Mellon University", "Carnegie Mellon", "Carnegie"] },
  { name: "California State University, Chico", acronym: "Chico State", slug: "chico-state", searchTerms: ["Chico State", "California State University Chico", "Chico", "Cal State Chico"] },
  { name: "Columbia University", acronym: "Columbia", slug: "columbia", searchTerms: ["Columbia", "Columbia University"] },
  { name: "Cornell University", acronym: "Cornell", slug: "cornell", searchTerms: ["Cornell", "Cornell University"] },
  { name: "Dartmouth College", acronym: "Dartmouth", slug: "dartmouth", searchTerms: ["Dartmouth", "Dartmouth College"] },
  { name: "Duke University", acronym: "Duke", slug: "duke", searchTerms: ["Duke", "Duke University"] },
  { name: "Florida State University", acronym: "FSU", slug: "fsu", searchTerms: ["FSU", "Florida State University", "Florida State"] },
  { name: "Georgetown University", acronym: "Georgetown", slug: "georgetown", searchTerms: ["Georgetown", "Georgetown University"] },
  { name: "Harvard University", acronym: "Harvard", slug: "harvard", searchTerms: ["Harvard", "Harvard University"] },
  { name: "Indiana University Bloomington", acronym: "IU Bloomington", slug: "iu-bloomington", searchTerms: ["IU Bloomington", "Indiana University Bloomington", "Indiana University", "IU"] },
  { name: "Massachusetts Institute of Technology", acronym: "MIT", slug: "mit", searchTerms: ["MIT", "Massachusetts Institute of Technology", "Massachusetts Institute"] },
  { name: "Michigan State University", acronym: "Michigan State", slug: "michigan-state", searchTerms: ["Michigan State", "Michigan State University", "MSU"] },
  { name: "New York University", acronym: "NYU", slug: "nyu", searchTerms: ["NYU", "New York University", "New York"] },
  { name: "Northeastern University", acronym: "Northeastern", slug: "northeastern", searchTerms: ["Northeastern", "Northeastern University"] },
  { name: "Northwestern University", acronym: "Northwestern", slug: "northwestern", searchTerms: ["Northwestern", "Northwestern University"] },
  { name: "Ohio State University", acronym: "Ohio State", slug: "ohio-state", searchTerms: ["Ohio State", "Ohio State University", "OSU"] },
  { name: "Pennsylvania State University", acronym: "Penn State", slug: "penn-state", searchTerms: ["Penn State", "Pennsylvania State University", "PSU"] },
  { name: "Princeton University", acronym: "Princeton", slug: "princeton", searchTerms: ["Princeton", "Princeton University"] },
  { name: "Purdue University", acronym: "Purdue", slug: "purdue", searchTerms: ["Purdue", "Purdue University"] },
  { name: "Rice University", acronym: "Rice", slug: "rice", searchTerms: ["Rice", "Rice University"] },
  { name: "California State University, Sacramento", acronym: "Sac State", slug: "sac-state", searchTerms: ["Sac State", "California State University Sacramento", "Sacramento", "Cal State Sacramento"] },
  { name: "San Francisco State University", acronym: "SF State", slug: "sf-state", searchTerms: ["SF State", "San Francisco State University", "San Francisco State", "SFSU"] },
  { name: "San Diego State University", acronym: "SDSU", slug: "sdsu", searchTerms: ["SDSU", "San Diego State University", "San Diego State"] },
  { name: "San Jose State University", acronym: "SJSU", slug: "sjsu", searchTerms: ["SJSU", "San Jose State University", "San Jose State"] },
  { name: "Stanford University", acronym: "Stanford", slug: "stanford", searchTerms: ["Stanford", "Stanford University"] },
  { name: "Texas A&M University", acronym: "Texas A&M", slug: "texas-aandm", searchTerms: ["Texas A&M", "Texas A&M University", "TAMU"] },
  { name: "University of Alabama", acronym: "UA", slug: "ua", searchTerms: ["UA", "University of Alabama", "Alabama"] },
  { name: "University of Arizona", acronym: "UArizona", slug: "uarizona", searchTerms: ["UArizona", "University of Arizona", "Arizona"] },
  { name: "University of California, Berkeley", acronym: "UC Berkeley", slug: "uc-berkeley", searchTerms: ["UC Berkeley", "University of California Berkeley", "Berkeley", "Cal"] },
  { name: "University of California, Davis", acronym: "UC Davis", slug: "uc-davis", searchTerms: ["UC Davis", "University of California Davis", "Davis"] },
  { name: "University of California, Irvine", acronym: "UC Irvine", slug: "uc-irvine", searchTerms: ["UC Irvine", "University of California Irvine", "Irvine", "UCI"] },
  { name: "University of California, Los Angeles", acronym: "UCLA", slug: "ucla", searchTerms: ["UCLA", "University of California Los Angeles", "Los Angeles", "UC Los Angeles"] },
  { name: "University of California, Merced", acronym: "UC Merced", slug: "uc-merced", searchTerms: ["UC Merced", "University of California Merced", "Merced"] },
  { name: "University of California, Riverside", acronym: "UC Riverside", slug: "uc-riverside", searchTerms: ["UC Riverside", "University of California Riverside", "Riverside", "UCR"] },
  { name: "University of California, San Diego", acronym: "UCSD", slug: "ucsd", searchTerms: ["UCSD", "University of California San Diego", "San Diego", "UC San Diego"] },
  { name: "University of California, Santa Barbara", acronym: "UCSB", slug: "ucsb", searchTerms: ["UC Santa Barbara", "University of California Santa Barbara", "Santa Barbara", "UCSB"] },
  { name: "University of California, Santa Cruz", acronym: "UC Santa Cruz", slug: "uc-santa-cruz", searchTerms: ["UC Santa Cruz", "University of California Santa Cruz", "Santa Cruz", "UCSC"] },
  { name: "University of Central Florida", acronym: "UCF", slug: "ucf", searchTerms: ["UCF", "University of Central Florida", "Central Florida"] },
  { name: "University of Chicago", acronym: "UChicago", slug: "uchicago", searchTerms: ["UChicago", "University of Chicago", "Chicago"] },
  { name: "University of Colorado Boulder", acronym: "CU Boulder", slug: "cu-boulder", searchTerms: ["CU Boulder", "University of Colorado Boulder", "Colorado Boulder", "Boulder"] },
  { name: "University of Florida", acronym: "UF", slug: "uf", searchTerms: ["UF", "University of Florida", "Florida"] },
  { name: "University of Georgia", acronym: "UGA", slug: "uga", searchTerms: ["UGA", "University of Georgia", "Georgia"] },
  { name: "University of Illinois Urbana-Champaign", acronym: "UIUC", slug: "uiuc", searchTerms: ["UIUC", "University of Illinois Urbana-Champaign", "University of Illinois", "Illinois"] },
  { name: "University of Miami", acronym: "UMiami", slug: "umiami", searchTerms: ["UMiami", "University of Miami", "Miami"] },
  { name: "University of Michigan", acronym: "UMich", slug: "umich", searchTerms: ["UMich", "University of Michigan", "Michigan"] },
  { name: "University of Minnesota", acronym: "UMN", slug: "umn", searchTerms: ["UMN", "University of Minnesota", "Minnesota"] },
  { name: "University of North Carolina at Chapel Hill", acronym: "UNC Chapel Hill", slug: "unc", searchTerms: ["UNC Chapel Hill", "University of North Carolina Chapel Hill", "Chapel Hill", "UNC"] },
  { name: "University of Oregon", acronym: "UOregon", slug: "uoregon", searchTerms: ["UOregon", "University of Oregon", "Oregon"] },
  { name: "University of Pennsylvania", acronym: "UPenn", slug: "upenn", searchTerms: ["UPenn", "University of Pennsylvania", "Pennsylvania", "Penn"] },
  { name: "University of Southern California", acronym: "USC", slug: "usc", searchTerms: ["USC", "University of Southern California", "Southern California"] },
  { name: "University of Texas at Austin", acronym: "UT Austin", slug: "ut-austin", searchTerms: ["UT Austin", "University of Texas Austin", "Texas Austin", "UT"] },
  { name: "University of Virginia", acronym: "UVA", slug: "uva", searchTerms: ["UVA", "University of Virginia", "Virginia"] },
  { name: "University of Washington", acronym: "UW", slug: "uw", searchTerms: ["UW", "University of Washington", "Washington"] },
  { name: "University of Wisconsin–Madison", acronym: "UW-Madison", slug: "uw-madison", searchTerms: ["UW-Madison", "University of Wisconsin Madison", "Wisconsin Madison", "Madison"] },
  { name: "Vanderbilt University", acronym: "Vanderbilt", slug: "vanderbilt", searchTerms: ["Vanderbilt", "Vanderbilt University"] },
  { name: "Virginia Polytechnic Institute and State University", acronym: "Virginia Tech", slug: "virginia-tech", searchTerms: ["Virginia Tech", "Virginia Polytechnic Institute", "VT", "VPI"] },
  { name: "Yale University", acronym: "Yale", slug: "yale", searchTerms: ["Yale", "Yale University"] }
];

// Smart search function
const searchSchools = (query: string) => {
  if (!query.trim()) return SCHOOLS;
  
  const searchTerm = query.toLowerCase().trim();
  const results = [];
  
  // First pass: Exact matches (highest priority)
  for (const school of SCHOOLS) {
    for (const keyword of school.searchTerms) {
      if (keyword.toLowerCase() === searchTerm) {
        results.push({ school, score: 100, matchType: 'exact' });
        break;
      }
    }
  }
  
  // Second pass: Starts with matches
  if (results.length < 10) {
    for (const school of SCHOOLS) {
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
    for (const school of SCHOOLS) {
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
  
  // Sort by score (highest first) and return results
  return results
    .sort((a, b) => b.score - a.score)
    .map(r => r.school);
};

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = searchSchools(searchQuery);

  const handleSchoolClick = (school: typeof SCHOOLS[0]) => {
    navigate(`/${school.slug}`);
  };

  const getSchoolInitials = (acronym: string) => {
    if (acronym.length <= 3) return acronym;
    return acronym.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 border-b bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/e9020b20-5a8d-4a80-a4e0-9d917c7c5e5c.png" 
                alt="FroshMeet Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <Button variant="ghost" onClick={() => navigate('/features')} className="text-muted-foreground hover:text-foreground">
                  Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/community')} className="text-foreground">
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
              <Button onClick={() => navigate('/community')} className="bg-primary hover:bg-primary/90">
                Join FroshMeet Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Start Exploring
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <div className="text-foreground">Explore the Community</div>
              <div className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                at your school
              </div>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find your school and connect with thousands of students in your community.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-primary" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg rounded-2xl border-primary/20 focus:border-primary/50 bg-card/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school) => (
              <div
                key={school.slug}
                onClick={() => handleSchoolClick(school)}
                className="group cursor-pointer"
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 border-2 border-primary/20 hover:border-primary/50 card-shadow group-hover:bg-card/80">
                  {/* School Circle */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center group-hover:neon-glow-strong transition-all duration-300 border-2 border-primary/30 group-hover:border-primary/60">
                    <span className="text-primary-foreground font-bold text-xl">
                      {getSchoolInitials(school.acronym)}
                    </span>
                  </div>
                  
                  {/* School Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl uppercase tracking-wide text-primary group-hover:neon-glow transition-all duration-300">
                      {school.acronym}
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                      {school.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSchools.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="bg-card/50 rounded-3xl p-8 border border-primary/20">
                <p className="text-muted-foreground text-lg mb-4">
                  No schools found matching "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't see your school?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're constantly adding new schools to FroshMeet. Let us know which school you'd like to see next!
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/contact')}
                className="bg-primary hover:bg-primary/90 neon-glow"
              >
                Request Your School
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;