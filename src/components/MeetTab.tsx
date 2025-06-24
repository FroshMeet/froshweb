
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, Users } from "lucide-react";
import SwipeCards from "./SwipeCards";

const MeetTab = ({ profiles }) => {
  const [meetMode, setMeetMode] = useState("general");

  const filteredProfiles = profiles.filter(profile => {
    if (meetMode === "roommate") {
      return profile.lookingFor.includes("Roommate");
    }
    return true;
  });

  return (
    <div className="max-w-lg mx-auto">
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
      </div>

      <SwipeCards profiles={filteredProfiles} />
    </div>
  );
};

export default MeetTab;
