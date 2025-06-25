
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, Users } from "lucide-react";
import SwipeCards from "../SwipeCards";

interface MeetTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
}

const MeetTabContent = ({ profiles, isGuest = false, onGuestAction }: MeetTabContentProps) => {
  const [meetMode, setMeetMode] = useState("general");

  const filteredProfiles = profiles.filter(profile => {
    if (meetMode === "roommate") {
      return profile.lookingFor.includes("Roommate");
    }
    return true;
  });

  const handleSwipeAction = (action: string) => {
    if (isGuest && onGuestAction && action === "like") {
      onGuestAction();
      return;
    }
    console.log("Swipe action:", action);
  };

  return (
    <div className="max-w-lg mx-auto pb-32">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Meet New People</h2>
        
        <ToggleGroup 
          type="single" 
          value={meetMode} 
          onValueChange={(value) => value && setMeetMode(value)}
          className="mb-6"
        >
          <ToggleGroupItem 
            value="general" 
            className="flex items-center space-x-2 px-6 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white"
          >
            <Heart className="h-4 w-4" />
            <span>General</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="roommate" 
            className="flex items-center space-x-2 px-6 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white"
          >
            <Users className="h-4 w-4" />
            <span>Roommates</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <p className="text-slate-600 mb-2">
          {meetMode === "general" 
            ? "Swipe to discover new friends and connections" 
            : "Find your perfect roommate match"}
        </p>
        
        {isGuest && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            Browsing as guest - create an account to message people
          </p>
        )}
      </div>

      <SwipeCards 
        profiles={filteredProfiles} 
        onShowIcebreakers={() => {}} // This prop is no longer used since SwipeCards handles its own modal
        onSwipeAction={handleSwipeAction}
        isGuest={isGuest}
        onGuestAction={onGuestAction}
      />
    </div>
  );
};

export default MeetTabContent;
