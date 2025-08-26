
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Users, Heart, Grid, Zap, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import { mockProfiles } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import DiscoverGrid from "../DiscoverGrid";

interface DiscoverTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  currentUser?: any;
  onUpdateUser?: (updatedUser: any) => void;
  schoolName?: string;
}

const DiscoverTabContent = ({ profiles, isGuest = false, onGuestAction, currentUser, onUpdateUser, schoolName }: DiscoverTabContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [discoverMode, setDiscoverMode] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [realProfiles, setRealProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isDevMode } = useAppState();
  
  // Use dev mode logic: mock data if dev mode is on, real data if off
  const effectiveProfiles = isDevMode ? mockProfiles : realProfiles;

  useEffect(() => {
    const fetchRealProfiles = async () => {
      if (isDevMode || !schoolName) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('school', schoolName)
          .eq('verified', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform to match expected format
        const transformedProfiles = (data || []).map(profile => ({
          id: profile.user_id,
          name: profile.name,
          age: 18,
          college: profile.school,
          school: profile.school,
          classOf: profile.class_year,
          major: profile.major,
          bio: profile.bio,
          interests: profile.interests || [],
          photos: profile.avatar_url ? [profile.avatar_url] : ["photo-1649972904349-6e44c42644a7"],
          lookingFor: profile.looking_for_roommate ? ["Friends", "Roommate"] : ["Friends"],
          location: profile.school,
          profilePic: profile.avatar_url || "photo-1649972904349-6e44c42644a7",
          lookingForRoommate: profile.looking_for_roommate
        }));
        
        setRealProfiles(transformedProfiles);
      } catch (error) {
        console.error('Error fetching real profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProfiles();
  }, [isDevMode, schoolName]);

  // Filter profiles based on search query (names only) and discover mode
  const filteredProfiles = effectiveProfiles.filter(profile => {
    const matchesSearch = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMode = discoverMode === "all" || 
      (discoverMode === "roommates" && profile.lookingFor?.includes("Roommate")) ||
      (discoverMode === "friends" && profile.lookingFor?.includes("Friends")) ||
      (discoverMode === "study" && profile.lookingFor?.includes("Study Buddy"));
    
    return matchesSearch && matchesMode;
  });

  // Get name suggestions based on current search
  const nameSuggestions = searchQuery.length > 0 
    ? effectiveProfiles
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

  // Show loading state for real data
  if (!isDevMode && loading) {
    return (
      <div className="h-full w-full">
        <div className="space-y-6">
          {/* Search Bar Skeleton */}
          <div className="sticky top-4 z-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          
          {/* Filter Toggles Skeleton */}
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-2 bg-muted p-1 rounded-lg">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
          </div>
          
          {/* Profile Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when dev mode is OFF and no real data
  if (!isDevMode && effectiveProfiles.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center px-6">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            No profiles yet for {schoolName}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Be the first to create your profile and start connecting with classmates!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Button 
              onClick={() => navigate('/create-profile')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create your profile
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/signup')}  
              size="lg"
            >
              Invite classmates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="pl-10 pr-4 py-2 border border-border focus:border-ring rounded-lg bg-background text-foreground"
          />
        </div>
        
        {/* Auto-suggestions dropdown */}
        {showSuggestions && nameSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 mt-1">
            {nameSuggestions.map((name, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 text-popover-foreground"
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
          className="grid grid-cols-4 gap-2 bg-muted p-1 rounded-lg"
        >
          <ToggleGroupItem 
            value="all" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground"
          >
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="friends" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Friends</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="roommates" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Roommates</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="study" 
            className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Study</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Results */}
      <div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
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
