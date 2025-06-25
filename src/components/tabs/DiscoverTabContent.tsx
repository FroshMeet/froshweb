
import DiscoverGrid from "../DiscoverGrid";

interface DiscoverTabContentProps {
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
}

const DiscoverTabContent = ({ profiles, isGuest = false, onGuestAction }: DiscoverTabContentProps) => {
  return <DiscoverGrid profiles={profiles} isGuest={isGuest} onGuestAction={onGuestAction} />;
};

export default DiscoverTabContent;
