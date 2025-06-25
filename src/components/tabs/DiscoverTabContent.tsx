
import DiscoverGrid from "../DiscoverGrid";
import PostProfileButton from "../PostProfileButton";

interface DiscoverTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  currentUser?: any;
  onUpdateUser?: (user: any) => void;
}

const DiscoverTabContent = ({ 
  profiles, 
  isGuest = false, 
  onGuestAction,
  currentUser,
  onUpdateUser 
}: DiscoverTabContentProps) => {
  const handlePost = () => {
    console.log("Profile posted to Discover");
    // Here you would typically add the user to the profiles list
  };

  return (
    <div className="space-y-4">
      {!isGuest && currentUser && (
        <div className="max-w-sm mx-auto">
          <PostProfileButton user={currentUser} onPost={handlePost} />
        </div>
      )}
      <DiscoverGrid profiles={profiles} isGuest={isGuest} onGuestAction={onGuestAction} />
    </div>
  );
};

export default DiscoverTabContent;
