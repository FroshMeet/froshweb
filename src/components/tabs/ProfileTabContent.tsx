
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
    // Here you would typically update the user's posting status and photos
    onUpdateUser({
      ...currentUser,
      photos: photos,
      isInMeet: inMeet,
      isInDiscover: inDiscover
    });
    setShowPostModal(false);
  };

  return (
    <div className="flex gap-6">
      {/* Left side - Profile */}
      <div className="flex-1 max-w-md">
        <ProfileCard profile={currentUser} isOwnProfile />
      </div>
      
      {/* Right side - Actions */}
      <div className="flex-1 max-w-md space-y-6">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full h-16 flex items-center justify-center space-x-3 text-lg font-semibold border-2"
        >
          <Settings className="h-6 w-6" />
          <span>Settings</span>
        </Button>
        
        <div className="space-y-6">
          <EditProfileDialog 
            user={currentUser} 
            onSave={onUpdateUser}
            className="w-full h-16 text-lg font-semibold"
          />
          <Button 
            onClick={() => setShowPostModal(true)}
            size="lg"
            className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold"
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
