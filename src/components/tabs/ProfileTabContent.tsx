
import ProfileCard from "../ProfileCard";
import EditProfileDialog from "../EditProfileDialog";

interface ProfileTabContentProps {
  currentUser: any;
  onUpdateUser: (updatedUser: any) => void;
}

const ProfileTabContent = ({ currentUser, onUpdateUser }: ProfileTabContentProps) => {
  return (
    <div className="space-y-4">
      <ProfileCard profile={currentUser} isOwnProfile />
      <EditProfileDialog user={currentUser} onSave={onUpdateUser} />
    </div>
  );
};

export default ProfileTabContent;
