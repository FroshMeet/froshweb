
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
  const [realProfiles, setRealProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDevMode } = useAppState();

  // Fetch real profiles when not in dev mode
  useEffect(() => {
    const fetchRealProfiles = async () => {
      if (isDevMode) return; // Use passed mock profiles in dev mode
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('verified', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform to match expected format
        const transformedProfiles = (data || []).map(profile => ({
          id: profile.user_id,
          name: profile.name,
          age: 18, // Default age
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
        setRealProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProfiles();
  }, [isDevMode]);

  // Use dev mode profiles or real profiles
  const activeProfiles = isDevMode ? profiles : realProfiles;

  const filteredProfiles = activeProfiles.filter(profile => {
    if (meetMode === "roommates") {
      // Roommates: Only show students from same school who are looking for roommates
      return profile.lookingFor?.includes("Roommate") && profile.school === schoolName;
    }
    // Everyone mode will be filtered in FroshMeetSwipeInterface based on scope
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

  // Show loading state when fetching real profiles
  if (!isDevMode && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no profiles available
  if (!isDevMode && activeProfiles.length === 0 && !loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center px-6">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Students Yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Be the first to create your profile and connect with other {schoolName} students!
          </p>
        </div>
      </div>
    );
  }

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
        schoolName={schoolName}
      />
    </div>
  );
};

export default MeetTabContent;
