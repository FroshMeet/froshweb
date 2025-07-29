
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import FroshMeetSwipeInterface from "../FroshMeetSwipeInterface";

interface MeetTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  schoolName?: string;
}

const MeetTabContent = ({
  profiles,
  isGuest = false,
  onGuestAction,
  schoolName = "BU"
}: MeetTabContentProps) => {
  const [meetMode, setMeetMode] = useState("everyone");
  const { isDevMode } = useAppState();

  // Filter profiles based on meetMode and schoolName
  const displayedProfiles = profiles.filter(profile => {
    if (meetMode === "roommates") {
      return profile.lookingFor?.includes("Roommate") && profile.school === schoolName;
    }
    return true; // Everyone mode: show all profiles
  });

  // Debug logging
  console.log('MeetTabContent debug:', {
    isDevMode,
    meetMode,
    schoolName,
    profilesLength: profiles.length,
    displayedProfilesLength: displayedProfiles.length
  });

  const handleSwipeAction = (action: string) => {
    // Only trigger guest action for like and message actions, not for pass/skip
    if (isGuest && onGuestAction && (action === "like" || action === "message")) {
      onGuestAction();
      return;
    }
    console.log("Swipe action:", action);
  };

  // Show empty state when no profiles available
  if (displayedProfiles.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center px-6">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            👋 Be the First Face on Campus — Post Now!
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Create your profile and connect with other {schoolName} students!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <FroshMeetSwipeInterface 
        profiles={displayedProfiles} 
        onShowIcebreakers={() => {}} 
        onSwipeAction={handleSwipeAction} 
        isGuest={isGuest} 
        onGuestAction={onGuestAction}
        meetMode={meetMode}
        setMeetMode={setMeetMode}
        schoolName={schoolName}
      />
    </div>
  );
};

export default MeetTabContent;
