import ClientShell from "@/components/discover/ClientShell";
import DevModeToggle from "@/components/dev-mode/DevModeToggle";

interface DiscoverTabContentProps {
  schoolName?: string;
  schoolSlug?: string;
}

const DiscoverTabContent = ({ schoolName, schoolSlug }: DiscoverTabContentProps) => {
  // IMPORTANT: Do not import Supabase here. Do not prefetch data here.
  return (
    <>
      <ClientShell schoolName={schoolName} schoolSlug={schoolSlug} />
      <DevModeToggle />
    </>
  );
};

export default DiscoverTabContent;