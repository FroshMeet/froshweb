import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";

const SCHOOLS = [
  { name: "Arizona State University", acronym: "ASU", slug: "asu" },
  { name: "Boston University", acronym: "BU", slug: "bu" },
  { name: "Brown University", acronym: "Brown", slug: "brown-university" },
  { name: "California State Polytechnic University, Pomona", acronym: "Cal Poly Pomona", slug: "cal-poly-pomona" },
  { name: "California Institute of Technology", acronym: "Caltech", slug: "caltech" },
  { name: "California Polytechnic State University, San Luis Obispo", acronym: "Cal Poly SLO", slug: "cal-poly-slo" },
  { name: "California State University, Long Beach", acronym: "CSULB", slug: "csulb" },
  { name: "Carnegie Mellon University", acronym: "CMU", slug: "cmu" },
  { name: "California State University, Chico", acronym: "Chico State", slug: "chico-state" },
  { name: "Columbia University", acronym: "Columbia", slug: "columbia-university" },
  { name: "Cornell University", acronym: "Cornell", slug: "cornell-university" },
  { name: "Dartmouth College", acronym: "Dartmouth", slug: "dartmouth-college" },
  { name: "Duke University", acronym: "Duke", slug: "duke-university" },
  { name: "Florida State University", acronym: "FSU", slug: "fsu" },
  { name: "Georgetown University", acronym: "Georgetown", slug: "georgetown-university" },
  { name: "Harvard University", acronym: "Harvard", slug: "harvard-university" },
  { name: "Indiana University Bloomington", acronym: "IU Bloomington", slug: "iu" },
  { name: "Massachusetts Institute of Technology", acronym: "MIT", slug: "mit" },
  { name: "Michigan State University", acronym: "Michigan State", slug: "msu" },
  { name: "New York University", acronym: "NYU", slug: "nyu" },
  { name: "Northeastern University", acronym: "Northeastern", slug: "northeastern-university" },
  { name: "Northwestern University", acronym: "Northwestern", slug: "northwestern-university" },
  { name: "Ohio State University", acronym: "Ohio State", slug: "osu" },
  { name: "Pennsylvania State University", acronym: "Penn State", slug: "psu" },
  { name: "Princeton University", acronym: "Princeton", slug: "princeton-university" },
  { name: "Purdue University", acronym: "Purdue", slug: "purdue-university" },
  { name: "Rice University", acronym: "Rice", slug: "rice-university" },
  { name: "California State University, Sacramento", acronym: "Sac State", slug: "sac-state" },
  { name: "San Francisco State University", acronym: "SF State", slug: "sf-state" },
  { name: "San Diego State University", acronym: "SDSU", slug: "sdsu" },
  { name: "San Jose State University", acronym: "SJSU", slug: "sjsu" },
  { name: "Stanford University", acronym: "Stanford", slug: "stanford-university" },
  { name: "Texas A&M University", acronym: "Texas A&M", slug: "texas-aandm" },
  { name: "University of Alabama", acronym: "UA", slug: "university-of-alabama" },
  { name: "University of Arizona", acronym: "UArizona", slug: "university-of-arizona" },
  { name: "University of California, Berkeley", acronym: "UC Berkeley", slug: "uc-berkeley" },
  { name: "University of California, Davis", acronym: "UC Davis", slug: "uc-davis" },
  { name: "University of California, Irvine", acronym: "UC Irvine", slug: "uc-irvine" },
  { name: "University of California, Los Angeles", acronym: "UCLA", slug: "ucla" },
  { name: "University of California, Merced", acronym: "UC Merced", slug: "uc-merced" },
  { name: "University of California, Riverside", acronym: "UC Riverside", slug: "uc-riverside" },
  { name: "University of California, San Diego", acronym: "UCSD", slug: "uc-san-diego" },
  { name: "University of California, Santa Barbara", acronym: "UC Santa Barbara", slug: "uc-santa-barbara" },
  { name: "University of California, Santa Cruz", acronym: "UC Santa Cruz", slug: "uc-santa-cruz" },
  { name: "University of Central Florida", acronym: "UCF", slug: "ucf" },
  { name: "University of Chicago", acronym: "UChicago", slug: "uchicago" },
  { name: "University of Colorado Boulder", acronym: "CU Boulder", slug: "cu-boulder" },
  { name: "University of Florida", acronym: "UF", slug: "uf" },
  { name: "University of Georgia", acronym: "UGA", slug: "uga" },
  { name: "University of Illinois Urbana-Champaign", acronym: "UIUC", slug: "uiuc" },
  { name: "University of Miami", acronym: "UMiami", slug: "university-of-miami" },
  { name: "University of Michigan", acronym: "UMich", slug: "university-of-michigan" },
  { name: "University of Minnesota", acronym: "UMN", slug: "university-of-minnesota" },
  { name: "University of North Carolina at Chapel Hill", acronym: "UNC Chapel Hill", slug: "unc" },
  { name: "University of Oregon", acronym: "UOregon", slug: "university-of-oregon" },
  { name: "University of Pennsylvania", acronym: "UPenn", slug: "upenn" },
  { name: "University of Southern California", acronym: "USC", slug: "usc" },
  { name: "University of Texas at Austin", acronym: "UT Austin", slug: "ut" },
  { name: "University of Virginia", acronym: "UVA", slug: "uva" },
  { name: "University of Washington", acronym: "UW", slug: "uw" },
  { name: "University of Wisconsin–Madison", acronym: "UW-Madison", slug: "uw-madison" },
  { name: "Vanderbilt University", acronym: "Vanderbilt", slug: "vanderbilt-university" },
  { name: "Virginia Polytechnic Institute and State University", acronym: "Virginia Tech", slug: "virginia-tech" },
  { name: "Yale University", acronym: "Yale", slug: "yale-university" }
];

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchools = SCHOOLS.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.acronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSchoolClick = (school: typeof SCHOOLS[0]) => {
    navigate(`/${school.slug}`);
  };

  const getSchoolInitials = (acronym: string) => {
    if (acronym.length <= 3) return acronym;
    return acronym.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <img 
                  src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                  alt="FroshMeet Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <Button onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              College Communities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find your school and connect with thousands of students in your community.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg rounded-2xl"
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.slug}
                onClick={() => handleSchoolClick(school)}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/30 card-shadow">
                  {/* School Circle */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center group-hover:neon-glow transition-all duration-300">
                    <span className="text-primary-foreground font-bold text-lg">
                      {getSchoolInitials(school.acronym)}
                    </span>
                  </div>
                  
                  {/* School Info */}
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {school.acronym}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {school.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSchools.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No schools found matching "{searchQuery}"
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't see your school?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're constantly adding new schools to FroshMeet. Let us know which school you'd like to see next!
              </p>
              <Button size="lg" onClick={() => navigate('/contact')}>
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