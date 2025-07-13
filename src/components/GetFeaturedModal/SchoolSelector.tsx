
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SCHOOL_DATABASE } from "@/config/schoolDatabase";

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
      if (results.some(r => r.school.label === school.label)) continue;
      
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
      if (results.some(r => r.school.label === school.label)) continue;
      
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

  const handleSchoolSelect = (schoolValue: string) => {
    onSchoolChange(schoolValue);
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
                key={school.value}
                className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/40 last:border-b-0 transition-colors"
                onClick={() => handleSchoolSelect(school.value)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-primary">{school.label.split(' ').map(word => word.charAt(0)).join('').toUpperCase()}</div>
                  <div className="text-sm text-foreground">{school.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
