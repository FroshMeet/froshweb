
import DiscoverGrid from "../DiscoverGrid";

interface DiscoverTabContentProps {
  profiles: any[];
}

const DiscoverTabContent = ({ profiles }: DiscoverTabContentProps) => {
  return <DiscoverGrid profiles={profiles} />;
};

export default DiscoverTabContent;
