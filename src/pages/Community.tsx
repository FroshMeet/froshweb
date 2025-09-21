import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { schools, School } from "@/data/schools";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";
import SharedNavigation from "@/components/layout/SharedNavigation";

// Import logos
import harvardLogo from "@/assets/logos/harvard.png";
import stanfordLogo from "@/assets/logos/stanford.png";
import mitLogo from "@/assets/logos/mit.png";
import uclaLogo from "@/assets/logos/ucla.png";
import yaleLogo from "@/assets/logos/yale.png";
import uscLogo from "@/assets/logos/usc.png";
import ucBerkeleyLogo from "@/assets/logos/uc-berkeley.png";
import nyuLogo from "@/assets/logos/nyu.png";
import umichLogo from "@/assets/logos/umich.png";
import dukeLogo from "@/assets/logos/duke.png";
import princetonLogo from "@/assets/logos/princeton.png";
import northwesternLogo from "@/assets/logos/northwestern.png";
import upennLogo from "@/assets/logos/upenn.png";
import columbiaLogo from "@/assets/logos/columbia.png";

const Community = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  // Use search results when there's a query, otherwise show all schools
  const { searchResults, search } = useSchoolSearch();
  
  const filteredSchools = searchQuery.trim() 
    ? searchResults 
    : schools;

  // Trigger search when query changes
  React.useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  const handleSchoolClick = (school: School) => {
    // Create a slug mapping from school data to approved school slugs
    const getSchoolSlug = (schoolData: School): string => {
      // First try to find by exact name match in approved schools
      const approvedSchool = Object.entries(APPROVED_SCHOOLS).find(([slug, data]) => 
        data.name === schoolData.name
      );
      
      if (approvedSchool) {
        return approvedSchool[0];
      }
      
      // Fallback to school.id if no approved school found
      return schoolData.id;
    };
    
    const slug = getSchoolSlug(school);
    navigate(`/${slug}`);
  };

  const getSchoolInitials = (name: string) => {
    // Use shortName if available, otherwise use name
    const displayName = schools.find(s => s.name === name)?.shortName || name;
    if (displayName.length <= 3) return displayName;
    return displayName.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  const getSchoolLogo = (id: string) => {
    const logoMap: Record<string, string> = {
      'harvard': harvardLogo,
      'stanford': '/lovable-uploads/Stanford_Logo.png',
      'mit': mitLogo,
      'ucla': '/lovable-uploads/UCLA_Logo.png',
      'yale': yaleLogo,
      'usc': '/lovable-uploads/USC_Logo.png',
      'uc-berkeley': ucBerkeleyLogo,
      'nyu': nyuLogo,
      'umich': umichLogo,
      'duke': dukeLogo,
      'princeton': '/lovable-uploads/Princeton_Logo.png',
      'northwestern': northwesternLogo,
      'upenn': '/lovable-uploads/UPenn_Logo.png',
      'columbia': columbiaLogo,
    };
    return logoMap[id];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SharedNavigation currentPage="community" />

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
            
            {/* Search Bar with live search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-primary" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Trigger search hook with new query
                  if (e.target.value.trim()) {
                    // The hook will handle the search automatically
                  }
                }}
                className="pl-10 h-12 text-lg rounded-2xl border-primary/20 focus:border-primary/50 bg-card/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Schools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                onClick={() => handleSchoolClick(school)}
                className="group cursor-pointer"
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 border-2 border-primary/20 hover:border-primary/50 card-shadow group-hover:bg-card/80">
                  {/* School Circle */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden group-hover:neon-glow-strong transition-all duration-300 border-2 border-primary/30 group-hover:border-primary/60">
                    {getSchoolLogo(school.id) ? (
                      <img 
                        src={getSchoolLogo(school.id)} 
                        alt={`${school.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">
                          {getSchoolInitials(school.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* School Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl uppercase tracking-wide text-primary group-hover:neon-glow transition-all duration-300">
                      {school.shortName || school.name}
                    </h3>
                    {school.shortName && (
                      <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                        {school.name}
                      </p>
                    )}
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