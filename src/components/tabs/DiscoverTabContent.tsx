
import DiscoverGrid from "../DiscoverGrid";

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
  return (
    <div className="space-y-8">
      <DiscoverGrid profiles={profiles} isGuest={isGuest} onGuestAction={onGuestAction} />
    </div>
  );
};

export default DiscoverTabContent;
