
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, Users } from "lucide-react";
import FroshMeetSwipeInterface from "../FroshMeetSwipeInterface";

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
  const [meetMode, setMeetMode] = useState("everyone");

  const filteredProfiles = profiles.filter(profile => {
    if (meetMode === "roommates") {
      return profile.lookingFor?.includes("Roommate");
    }
    return true;
  });

  const handleSwipeAction = (action: string) => {
    // Only trigger guest action for like and message actions, not for pass/skip
    if (isGuest && onGuestAction && (action === "like" || action === "message")) {
      onGuestAction();
      return;
    }
    console.log("Swipe action:", action);
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <FroshMeetSwipeInterface 
        profiles={filteredProfiles} 
        onShowIcebreakers={() => {}} 
        onSwipeAction={handleSwipeAction} 
        isGuest={isGuest} 
        onGuestAction={onGuestAction}
        meetMode={meetMode}
        setMeetMode={setMeetMode}
        schoolName="UMN"
      />
    </div>
  );
};

export default MeetTabContent;
