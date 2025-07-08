import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Globe, Users, Heart, X, MessageSquare } from "lucide-react";
import SwipeCards from "./SwipeCards";

interface SwipeInterfaceProps {
  schoolName: string;
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  onClose: () => void;
  mode: "meet" | "roommate";
}

const SwipeInterface = ({ 
  schoolName, 
  profiles, 
  isGuest = true, 
  onGuestAction, 
  onClose,
  mode
}: SwipeInterfaceProps) => {
  const [filter, setFilter] = useState<"all" | "roommates">("all");
  const [location, setLocation] = useState<"domestic" | "international">("domestic");

  const filteredProfiles = profiles.filter(profile => {
    // Filter by roommate preference if "roommates" is selected
    if (filter === "roommates" && !profile.lookingFor?.includes("Roommate")) {
      return false;
    }
    
    // Filter by location (mock logic - in real app this would be based on actual data)
    // For now, just return all profiles regardless of location filter
    return true;
  });

  const handleSwipeAction = (action: string) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    console.log(`${action} on profile`);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{schoolName}</h2>
            <p className="text-sm text-muted-foreground">
              {mode === "meet" ? "Meet students" : "Find roommates"}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter Toggles */}
        <div className="flex gap-4">
          {/* All / Roommates Toggle */}
          <ToggleGroup 
            type="single" 
            value={filter} 
            onValueChange={(value) => value && setFilter(value as "all" | "roommates")}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="all" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="roommates" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              Roommates
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Domestic / International Toggle */}
          <ToggleGroup 
            type="single" 
            value={location} 
            onValueChange={(value) => value && setLocation(value as "domestic" | "international")}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="domestic" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              Domestic
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="international" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              International
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Guest Warning */}
        {isGuest && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You're browsing as a guest. Create an account to match and message students.
            </p>
          </div>
        )}
      </div>

      {/* Swipe Cards */}
      <div className="flex-1 overflow-hidden">
        <SwipeCards
          profiles={filteredProfiles}
          onShowIcebreakers={() => {}}
          onSwipeAction={handleSwipeAction}
          isGuest={isGuest}
          onGuestAction={onGuestAction}
          meetMode={filter}
          setMeetMode={(mode: string) => setFilter(mode as "all" | "roommates")}
        />
      </div>
    </div>
  );
};

export default SwipeInterface;