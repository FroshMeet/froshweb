import WelcomeScreen from "@/components/WelcomeScreen";
import MeetTabContent from "@/components/tabs/MeetTabContent";
import DiscoverTabContent from "@/components/tabs/DiscoverTabContent";
import CommunityTabContent from "@/components/tabs/CommunityTabContent";
import ChatsTabContent from "@/components/tabs/ChatsTabContent";
import ProfileTabContent from "@/components/tabs/ProfileTabContent";
import GuestProfile from "@/components/GuestProfile";
import GuestMessageDialog from "@/components/GuestMessageDialog";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { mockUser, mockProfiles } from "@/data/mockData";
import { useAppState } from "@/hooks/useAppState";

const Index = () => {
  const {
    currentUser,
    setCurrentUser,
    isGuest,
    guestSchool,
    activeTab,
    setActiveTab,
    showGuestDialog,
    setShowGuestDialog,
    handleGuestContinue,
    handleCreateAccount,
    handleGuestAction
  } = useAppState();

  if (!currentUser && !isGuest) {
    return <WelcomeScreen onUserCreate={setCurrentUser} onGuestContinue={handleGuestContinue} />;
  }

  const displayUser = currentUser || {
    ...mockUser,
    college: guestSchool || "Arizona State University"
  };

  const renderContent = () => {
    switch (activeTab) {
      case "meet":
        return <MeetTabContent profiles={mockProfiles} isGuest={isGuest} onGuestAction={handleGuestAction} />;
      case "discover":
        return <DiscoverTabContent profiles={mockProfiles} isGuest={isGuest} onGuestAction={handleGuestAction} currentUser={currentUser} onUpdateUser={setCurrentUser} />;
      case "community":
        return <CommunityTabContent />;
      case "chats":
        return isGuest ? (
          <div className="max-w-lg mx-auto pb-32 text-center">
            <p className="text-muted-foreground mt-8 text-lg">Create an account to view your chats</p>
          </div>
        ) : (
          <ChatsTabContent />
        );
      case "profile":
        return isGuest ? (
          <GuestProfile onCreateAccount={handleCreateAccount} />
        ) : (
          <ProfileTabContent currentUser={displayUser} onUpdateUser={setCurrentUser} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-background to-background/95 flex flex-col overflow-hidden">
      <AppHeader displayUser={displayUser} isGuest={isGuest} />
      
      <main className="flex-1 overflow-hidden bg-transparent smooth-transition">
        {renderContent()}
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <GuestMessageDialog 
        isOpen={showGuestDialog} 
        onClose={() => setShowGuestDialog(false)} 
        onCreateAccount={handleCreateAccount} 
      />
    </div>
  );
};

export default Index;