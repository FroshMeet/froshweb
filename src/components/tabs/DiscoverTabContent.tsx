
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Users, Heart, Grid, Zap } from "lucide-react";
import DiscoverGrid from "../DiscoverGrid";

interface DiscoverTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  currentUser?: any;
  onUpdateUser?: (updatedUser: any) => void;
}

const DiscoverTabContent = ({ profiles, isGuest = false, onGuestAction, currentUser, onUpdateUser }: DiscoverTabContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discoverMode, setDiscoverMode] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter profiles based on search query (names only) and discover mode
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMode = discoverMode === "all" || 
      (discoverMode === "roommates" && profile.lookingFor.includes("Roommate")) ||
      (discoverMode === "friends" && profile.lookingFor.includes("Friends")) ||
      (discoverMode === "study" && profile.lookingFor.includes("Study Buddy"));
    
    return matchesSearch && matchesMode;
  });

  // Get name suggestions based on current search
  const nameSuggestions = searchQuery.length > 0 
    ? profiles
        .filter(profile => 
          profile.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          profile.name.toLowerCase() !== searchQuery.toLowerCase()
        )
        .slice(0, 5)
        .map(profile => profile.name)
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="pl-10 pr-4 py-2 border-2 border-slate-200 focus:border-slate-400 rounded-lg"
          />
        </div>
        
        {/* Auto-suggestions dropdown */}
        {showSuggestions && nameSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 mt-1">
            {nameSuggestions.map((name, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                onClick={() => handleSuggestionClick(name)}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggles */}
      <div className="flex justify-center">
        <ToggleGroup 
          type="single" 
          value={discoverMode} 
          onValueChange={(value) => value && setDiscoverMode(value)}
          className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-lg"
        >
          <ToggleGroupItem 
            value="all" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="friends" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Friends</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="roommates" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Roommates</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="study" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Study</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Results */}
      <div>
        {searchQuery && (
          <p className="text-sm text-slate-600 mb-4">
            {filteredProfiles.length} result{filteredProfiles.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}
        
        <DiscoverGrid 
          profiles={filteredProfiles} 
          isGuest={isGuest} 
          onGuestAction={onGuestAction}
        />
      </div>
    </div>
  );
};

export default DiscoverTabContent;
