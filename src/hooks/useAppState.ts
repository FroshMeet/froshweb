import { useState, useEffect } from "react";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSchool, setGuestSchool] = useState("");
  const [activeTab, setActiveTab] = useState("meet");
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [isDevMode, setIsDevMode] = useState(true); // Enable dev mode by default

  // Enable dev mode automatically when no user is logged in
  useEffect(() => {
    if (!currentUser && isDevMode) {
      console.log("🧪 Dev Mode: Auto-signing in dev user for testing");
      setCurrentUser(DEV_USER);
      setIsGuest(false);
    }
  }, [currentUser, isDevMode]);

  const handleGuestContinue = (selectedSchool: string) => {
    setIsGuest(true);
    setGuestSchool(selectedSchool);
    setCurrentUser(null);
  };

  const handleCreateAccount = () => {
    setIsGuest(false);
    setCurrentUser(null);
    setShowGuestDialog(false);
  };

  const handleGuestAction = () => {
    // In dev mode, don't show guest dialog, just log the action
    if (isDevMode) {
      console.log("🧪 Dev Mode: Guest action triggered (normally would show signup)");
      return;
    }
    setShowGuestDialog(true);
  };

  const toggleDevMode = () => {
    setIsDevMode(!isDevMode);
    if (!isDevMode) {
      setCurrentUser(DEV_USER);
      setIsGuest(false);
    } else {
      setCurrentUser(null);
    }
  };

  return {
    currentUser,
    setCurrentUser,
    isGuest,
    setIsGuest,
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
    toggleDevMode
  };
};