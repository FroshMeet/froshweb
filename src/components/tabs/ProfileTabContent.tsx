
import ProfileCard from "../ProfileCard";
import EditProfileDialog from "../EditProfileDialog";
import PostProfileButton from "../PostProfileButton";

interface ProfileTabContentProps {
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
}

const ProfileTabContent = ({ currentUser, onUpdateUser }: ProfileTabContentProps) => {
  const handlePost = () => {
    console.log("Profile posted to Meet and Discover");
    // Here you would typically update the user's posting status
  };

  return (
    <div className="space-y-4">
      <ProfileCard profile={currentUser} isOwnProfile />
      <EditProfileDialog user={currentUser} onSave={onUpdateUser} />
      <PostProfileButton user={currentUser} onPost={handlePost} />
    </div>
  );
};

export default ProfileTabContent;
