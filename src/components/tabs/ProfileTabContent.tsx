
import ProfileCard from "../ProfileCard";

interface ProfileTabContentProps {
  currentUser: any;
}

const ProfileTabContent = ({ currentUser }: ProfileTabContentProps) => {
  return <ProfileCard profile={currentUser} isOwnProfile />;
};

export default ProfileTabContent;
