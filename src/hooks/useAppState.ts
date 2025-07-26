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
  const [isDevMode, setIsDevMode] = useState(true); // Enable dev mode by default

  // Determine current user - prioritize real auth, fallback to dev mode
  const currentUser = user ? {
    id: user.id,
    name: userProfile?.name || user.email?.split('@')[0] || "User",
    college: userProfile?.school || "Unknown School",
    major: userProfile?.major || "Undeclared",
    bio: userProfile?.bio || "New FroshMeet user",
    interests: userProfile?.interests || [],
    lookingForRoommate: userProfile?.looking_for_roommate || false,
    classOf: userProfile?.class_year || "2029",
    verified: userProfile?.verified || false
  } : (isDevMode ? { ...DEV_USER, verified: true } : null);

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
    // Only show guest dialog for true guests (not dev mode or logged in users)
    if (!user && !isDevMode) {
      setShowGuestDialog(true);
      return;
    }
    
    // In dev mode or with real auth, actions should work normally
    console.log("🧪 Action available - user authenticated or in dev mode");
  };

  const toggleDevMode = () => {
    setIsDevMode(!isDevMode);
  };

  return {
    currentUser,
    isGuest: !user && !isDevMode,
    guestSchool,
    setGuestSchool,
    activeTab,
    setActiveTab,
    showGuestDialog,
    setShowGuestDialog,
    handleGuestContinue,
    handleCreateAccount,
    handleGuestAction,
    isDevMode,
    toggleDevMode,
    isAuthenticated: !!(user || isDevMode),
    isVerified: !!(user ? userProfile?.verified : isDevMode)
  };
};