import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FEATURED_SCHOOLS = [
  "Alabama", "ASU", "UC Berkeley", "Boston University", "Brown", "Cal Poly Pomona", 
  "Cal Poly SLO", "Caltech", "Carnegie Mellon", "Chico State", "Columbia", "Cornell", 
  "CSULB", "Dartmouth", "Duke", "Florida State", "Georgetown", "Georgia", "Harvard", 
  "Indiana", "Iowa State", "MIT", "Michigan", "Michigan State", "Minnesota", 
  "Northeastern", "Northwestern", "NYU", "Ohio State", "Penn State", "Princeton", 
  "Purdue", "Rice", "Sac State", "San Diego State", "San Francisco State", "SJSU", 
  "Stanford", "Texas A&M", "UC Davis", "UC Irvine", "UCLA", "UC Merced", 
  "UC Riverside", "UC San Diego", "UC Santa Barbara", "UC Santa Cruz", "UCF", 
  "UChicago", "UIUC", "UNC", "University of Arizona", "University of Central Florida", 
  "University of Colorado Boulder", "University of Florida", "University of Miami", 
  "University of Oregon", "University of Texas", "University of Virginia", 
  "University of Washington", "UPenn", "USC", "Vanderbilt", "Virginia Tech", 
  "Wisconsin", "Yale"
];

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const handleSchoolSelect = (school: string) => {
    const schoolSlug = school.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    navigate(`/${schoolSlug}`);
  };

  const filteredSchools = FEATURED_SCHOOLS.filter(school =>
    school.toLowerCase().startsWith(searchTerm.toLowerCase())
  ).slice(0, 10);

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
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">FroshMeet</h1>
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
                        key={school}
                        className="p-3 hover:bg-muted cursor-pointer text-sm border-b border-border last:border-b-0"
                        onClick={() => {
                          setSearchTerm("");
                          handleSchoolSelect(school);
                        }}
                      >
                        {school}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={() => searchTerm && filteredSchools.length > 0 && handleSchoolSelect(filteredSchools[0])}
                disabled={!searchTerm || filteredSchools.length === 0}
                className="w-full h-12 text-lg"
                size="lg"
              >
                Explore {searchTerm && filteredSchools.length > 0 ? filteredSchools[0] : "School"} Community
              </Button>
            </div>
          </div>

          {/* Featured Schools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {FEATURED_SCHOOLS.slice(0, 8).map((school) => (
              <Button
                key={school}
                variant="outline"
                onClick={() => handleSchoolSelect(school)}
                className="h-20 flex flex-col items-center justify-center text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-semibold text-xs">
                    {school.charAt(0)}
                  </span>
                </div>
                {school}
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