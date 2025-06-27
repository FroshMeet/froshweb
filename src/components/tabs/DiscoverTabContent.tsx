
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.interests?.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3 text-lg rounded-full border-2 border-slate-200 focus:border-slate-400 transition-colors"
        />
      </div>
      
      <DiscoverGrid 
        profiles={filteredProfiles} 
        isGuest={isGuest} 
        onGuestAction={onGuestAction} 
      />
    </div>
  );
};

export default DiscoverTabContent;
