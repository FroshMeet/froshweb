
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

const MeetTabContent = ({
  profiles,
  isGuest = false,
  onGuestAction
}: MeetTabContentProps) => {
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
    <div className="h-screen w-full overflow-hidden flex flex-col" style={{ height: '100vh', boxSizing: 'border-box' }}>
      {/* Toggle Group - Mobile only */}
      <div className="md:hidden flex-shrink-0 bg-white px-4 py-2">
        <ToggleGroup 
          type="single" 
          value={meetMode} 
          onValueChange={value => value && setMeetMode(value)} 
          className="w-full justify-center"
        >
          <ToggleGroupItem 
            value="general" 
            className="flex items-center space-x-2 px-4 py-1 text-sm data-[state=on]:bg-slate-900 data-[state=on]:text-white"
          >
            <Heart className="h-4 w-4" />
            <span>General</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="roommate" 
            className="flex items-center space-x-2 px-4 py-1 text-sm data-[state=on]:bg-slate-900 data-[state=on]:text-white"
          >
            <Users className="h-4 w-4" />
            <span>Roommates</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {isGuest && (
          <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mt-1 text-center">
            Browsing as guest - create an account to message people
          </p>
        )}
      </div>

      {/* Profile Content - Full remaining height */}
      <div className="flex-1 min-h-0 bg-white overflow-hidden">
        <SwipeCards 
          profiles={filteredProfiles} 
          onShowIcebreakers={() => {}} 
          onSwipeAction={handleSwipeAction} 
          isGuest={isGuest} 
          onGuestAction={onGuestAction}
          meetMode={meetMode}
          setMeetMode={setMeetMode}
        />
      </div>
    </div>
  );
};

export default MeetTabContent;
