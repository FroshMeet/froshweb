
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, Users } from "lucide-react";
import SwipeCards from "../SwipeCards";

interface MeetTabContentProps {
  profiles: any[];
}

const MeetTabContent = ({ profiles }: MeetTabContentProps) => {
  const [meetMode, setMeetMode] = useState("general");
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const icebreakers = [
    "Hey! 👋",
    "Hi there!",
    "Where are you from?",
    "What dorm are you in?"
  ];

  const filteredProfiles = profiles.filter(profile => {
    if (meetMode === "roommate") {
      return profile.lookingFor.includes("Roommate");
    }
    return true;
  });

  const handleSendIcebreaker = (message: string) => {
    console.log("Sending icebreaker:", message);
    setShowIcebreakers(false);
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
      </div>

      {showIcebreakers && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-center mb-4">Send an icebreaker</h3>
            {icebreakers.map((icebreaker, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSendIcebreaker(icebreaker)}
                className="w-full text-left justify-start h-auto p-4"
              >
                {icebreaker}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => setShowIcebreakers(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <SwipeCards 
        profiles={filteredProfiles} 
        onShowIcebreakers={() => setShowIcebreakers(true)}
      />
    </div>
  );
};

export default MeetTabContent;
