
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
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col">
        {/* Toggle and Guest Message - Fixed at top */}
        <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-slate-200/50">
          <ToggleGroup 
            type="single" 
            value={meetMode} 
            onValueChange={value => value && setMeetMode(value)} 
            className="mb-2"
          >
            <ToggleGroupItem value="general" className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
              <Heart className="h-4 w-4" />
              <span>General</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="roommate" className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
              <Users className="h-4 w-4" />
              <span>Roommates</span>
            </ToggleGroupItem>
          </ToggleGroup>

          {isGuest && (
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              Browsing as guest - create an account to message people
            </p>
          )}
        </div>

        {/* Profile Content - Fill remaining space */}
        <div className="flex-1 min-h-0">
          <SwipeCards 
            profiles={filteredProfiles} 
            onShowIcebreakers={() => {}} 
            onSwipeAction={handleSwipeAction} 
            isGuest={isGuest} 
            onGuestAction={onGuestAction} 
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full flex-col">
        {/* Toggle and Guest Message - Fixed at top */}
        <div className="flex-shrink-0 bg-white px-6 py-4 border-b border-slate-200/50">
          <ToggleGroup 
            type="single" 
            value={meetMode} 
            onValueChange={value => value && setMeetMode(value)} 
            className="mb-3"
          >
            <ToggleGroupItem value="general" className="flex items-center space-x-2 px-6 py-3 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
              <Heart className="h-5 w-5" />
              <span>General</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="roommate" className="flex items-center space-x-2 px-6 py-3 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
              <Users className="h-5 w-5" />
              <span>Roommates</span>
            </ToggleGroupItem>
          </ToggleGroup>

          {isGuest && (
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
              Browsing as guest - create an account to message people
            </p>
          )}
        </div>

        {/* Profile Content - Fill remaining space */}
        <div className="flex-1 min-h-0">
          <SwipeCards 
            profiles={filteredProfiles} 
            onShowIcebreakers={() => {}} 
            onSwipeAction={handleSwipeAction} 
            isGuest={isGuest} 
            onGuestAction={onGuestAction} 
          />
        </div>
      </div>
    </div>
  );
};

export default MeetTabContent;
