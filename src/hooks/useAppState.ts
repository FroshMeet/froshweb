import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Dev mode user for testing
const DEV_USER = {
  id: "dev-user-123",
  name: "Dev Student",
  age: 18,
  college: "Test University",
  classOf: "2029",
  major: "Computer Science",
  bio: "Testing the FroshMeet interface!",
  interests: ["Testing", "UI/UX", "Development"],
  photos: ["photo-1649972904349-6e44c42644a7"],
  lookingFor: ["Friends", "Roommate"],
  location: "Test University",
  profilePic: "photo-1649972904349-6e44c42644a7",
  lookingForRoommate: true
};

export const useAppState = () => {
  const { user, userProfile } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [guestSchool, setGuestSchool] = useState("");
  const [activeTab, setActiveTab] = useState("meet");
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  // Dev mode removed - now handled by DevModeProvider

  // Determine current user - prioritize real auth, fallback to null (dev mode handled elsewhere)
  const currentUser = user ? {
    id: user.id,
    name: userProfile?.name || user.email?.split('@')[0] || "User",
    college: userProfile?.school || "Unknown School",
    major: userProfile?.major || "Undeclared",
    bio: userProfile?.bio || "New FroshMeet user",
    interests: userProfile?.interests || [],
    lookingForRoommate: userProfile?.looking_for_roommate || false,
    classOf: userProfile?.class_year || "2029"
  } : null;

  const handleGuestContinue = (selectedSchool: string) => {
    setIsGuest(true);
    setGuestSchool(selectedSchool);
  };

  const handleCreateAccount = () => {
    setIsGuest(false);
    setShowGuestDialog(false);
    // Navigation will be handled by the auth system
  };

  const handleGuestAction = () => {
    // For guests trying to access restricted features, show signup dialog
    if (isGuest || !user) {
      setShowGuestDialog(true);
      return;
    }
  };

  return {
    currentUser,
    isGuest: isGuest || !user,
    guestSchool,
    setGuestSchool,
    activeTab,
    setActiveTab,
    showGuestDialog,
    setShowGuestDialog,
    handleGuestContinue,
    handleCreateAccount,
    handleGuestAction
  };
};