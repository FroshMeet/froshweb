
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
    <div className="h-screen w-full" style={{ height: '100vh', overflow: 'hidden', boxSizing: 'border-box' }}>
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
  );
};

export default MeetTabContent;
