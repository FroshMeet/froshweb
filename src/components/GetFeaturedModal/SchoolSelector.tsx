
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Use the EXACT same school database as homepage
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

interface SchoolSelectorProps {
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
}

// Copy exact search function from homepage
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

export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  selectedSchool,
  onSchoolChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSchools = searchSchools(searchTerm);

  const handleSchoolSelect = (schoolSlug: string) => {
    onSchoolChange(schoolSlug);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="school">Search for your school</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search schools, cities, or acronyms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 pl-10 text-lg bg-card/50 border-border/40"
        />
        {searchTerm && filteredSchools.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-[9999] shadow-2xl animate-fade-scale-in">
            {filteredSchools.slice(0, 5).map((school) => (
              <div
                key={school.slug}
                className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/40 last:border-b-0 transition-colors"
                onClick={() => handleSchoolSelect(school.slug)}
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
    </div>
  );
};
