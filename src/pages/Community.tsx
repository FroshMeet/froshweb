import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import SharedNavigation from '@/components/layout/SharedNavigation';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';
import { schools, School } from '@/data/schools';
import { getCorrectSchoolSlug } from '@/utils/schoolNavigation';
import { SEO } from '@/components/seo/SEO';
import { organizationSchema, websiteSchema } from '@/utils/seoSchema';
import { getSchoolImageUrl, hasSchoolImage } from '@/utils/schoolImages';

// Same popularity order used by the homepage carousel
const POPULARITY_ORDER = [
  'harvard', 'stanford', 'usc', 'ucla', 'umich', 'nyu', 'mit', 'duke',
  'upenn', 'cornell', 'ucberkeley', 'northwestern', 'uga', 'utaustin',
  'ohiostate', 'asu', 'uf', 'vanderbilt', 'unc', 'uva', 'yale',
  'princeton', 'columbia', 'uwmadison',
];

function sortByPopularity(list: School[]): School[] {
  return [...list].sort((a, b) => {
    const ai = POPULARITY_ORDER.indexOf(a.id);
    const bi = POPULARITY_ORDER.indexOf(b.id);
    // Schools not in the list go to the end, alphabetically
    if (ai === -1 && bi === -1) return (a.shortName || a.name).localeCompare(b.shortName || b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { searchResults, search } = useSchoolSearch();

  const filteredSchools = searchQuery.trim()
    ? searchResults
    : sortByPopularity(schools);

  React.useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  const handleSchoolClick = (school: School) => {
    const correctSlug = getCorrectSchoolSlug(school);
    navigate(`/${correctSlug}`);
  };

  const getSchoolInitials = (name: string) => {
    const displayName = schools.find(s => s.name === name)?.shortName || name;
    if (displayName.length <= 3) return displayName;
    return displayName.split(' ').map(word => word[0]).join('').slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <SEO
        title="Frosh for Colleges | 100+ School Communities Across the U.S."
        description="Frosh unites over 100 college communities including Harvard, Stanford, MIT, UCLA, USC, Yale, and more. Connect with Class of 2030 students at your university before classes begin."
        keywords="frosh colleges, frosh universities, college communities, Harvard frosh, Stanford frosh, MIT frosh, UCLA frosh, USC frosh, college Class of 2030"
        canonical="/community"
        schema={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, websiteSchema]
        }}
      />
      <SharedNavigation currentPage="community" />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
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

            <div className="relative max-w-md mx-auto group">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-froshmeet-blue transition-transform duration-200 group-hover:scale-110" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg rounded-2xl border-border/30 bg-card/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school) => (
              <div key={school.id} onClick={() => handleSchoolClick(school)} className="group cursor-pointer">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/5 border-2 border-white/25 hover:border-white/50 card-shadow group-hover:bg-card/80 frosted-card">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden transition-all duration-300 border-2 border-white/20 group-hover:border-white/40">
                    {hasSchoolImage(school.id) ? (
                      <img
                        src={getSchoolImageUrl(school.id)!}
                        alt={`${school.shortName || school.name} profile`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">
                          {getSchoolInitials(school.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl uppercase tracking-wide text-primary transition-all duration-300">
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

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-3xl p-12 backdrop-blur-sm frosted-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't see your school?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're constantly adding new schools to Frosh. Let us know which school you'd like to see next!
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
