import { useState } from "react";

export const useAppState = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSchool, setGuestSchool] = useState("");
  const [activeTab, setActiveTab] = useState("meet");
  const [showGuestDialog, setShowGuestDialog] = useState(false);

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
    setShowGuestDialog(true);
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
    handleGuestAction
  };
};