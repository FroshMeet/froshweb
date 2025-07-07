
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileCard from "../ProfileCard";
import EditProfileDialog from "../EditProfileDialog";
import PostProfileModal from "../PostProfileModal";
import { useState } from "react";

interface ProfileTabContentProps {
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
}

const ProfileTabContent = ({ currentUser, onUpdateUser }: ProfileTabContentProps) => {
  const [showPostModal, setShowPostModal] = useState(false);

  const handlePost = (photos: string[], inMeet: boolean, inDiscover: boolean) => {
    console.log("Profile posted with photos:", photos, "Meet:", inMeet, "Discover:", inDiscover);
    onUpdateUser({
      ...currentUser,
      photos: photos,
      isInMeet: inMeet,
      isInDiscover: inDiscover
    });
    setShowPostModal(false);
  };

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-6 max-w-6xl mx-auto">
        {/* Left side - Profile */}
        <div className="flex-1 max-w-md">
          <ProfileCard profile={currentUser} isOwnProfile />
        </div>
        
        {/* Right side - Actions */}
        <div className="flex-1 max-w-md space-y-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-32 flex items-center justify-center space-x-3 text-lg font-semibold border-2"
          >
            <Settings className="h-6 w-6" />
            <span>Settings</span>
          </Button>
          
          <div className="space-y-4">
            <EditProfileDialog 
              user={currentUser} 
              onSave={onUpdateUser}
              className="w-full h-32 text-lg font-semibold"
            />
            <Button 
              onClick={() => setShowPostModal(true)}
              size="lg"
              className="w-full h-32 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold neon-glow-strong"
            >
              Post Your Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-sm mx-auto">
        <ProfileCard profile={currentUser} isOwnProfile isMobile />
        
        <div className="mt-4 space-y-3">
          <Button 
            onClick={() => setShowPostModal(true)}
            size="lg"
            className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold neon-glow-strong"
          >
            Post Your Profile
          </Button>
        </div>
      </div>

      <PostProfileModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPost={handlePost}
        currentPhotos={currentUser?.photos || []}
      />
    </div>
  );
};

export default ProfileTabContent;
