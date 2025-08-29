import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/useAppState";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoverTabContentProps {
  schoolName?: string;
  schoolSlug?: string;
}

const DiscoverTabContent = ({ schoolName, schoolSlug }: DiscoverTabContentProps) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { isDevMode, currentUser } = useAppState();
  
  // Mock data for dev mode
  const mockProfiles = [
    {
      id: "1",
      display_name: "Alex Johnson",
      class_year: "2028",
      bio: "Pre-med student looking for study buddies and new friends!",
      tags: ["Study", "Friends"],
      avatar_url: "/placeholder.svg"
    },
    {
      id: "2", 
      display_name: "Sam Chen",
      class_year: "2028",
      bio: "CS major interested in AI/ML. Love hiking and coffee!",
      tags: ["Friends", "Study"],
      avatar_url: "/placeholder.svg"
    },
    {
      id: "3",
      display_name: "Jordan Taylor",
      class_year: "2028", 
      bio: "Business major seeking roommate for sophomore year.",
      tags: ["Roommate", "Friends"],
      avatar_url: "/placeholder.svg"
    },
    {
      id: "4",
      display_name: "Riley Martinez",
      class_year: "2028",
      bio: "Psychology major passionate about mental health advocacy.",
      tags: ["Study", "Friends"],
      avatar_url: "/placeholder.svg"
    },
    {
      id: "5",
      display_name: "Casey Park",
      class_year: "2028",
      bio: "Engineering student who loves building apps and playing guitar.",
      tags: ["Study", "Roommate"],
      avatar_url: "/placeholder.svg"
    }
  ];

  // Use dev mode logic: mock data if dev mode is on, real data if off
  const effectiveProfiles = isDevMode ? mockProfiles : profiles;

  useEffect(() => {
    const fetchProfiles = async () => {
      if (isDevMode || !currentUser || !schoolSlug) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('list_school_discover_profiles', {
          school_slug_param: schoolSlug,
          filters: [],
          search_query: searchQuery,
          limit_count: 60
        });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [isDevMode, currentUser, schoolSlug, searchQuery]);

  // Show loading state only for real data
  if (!isDevMode && loading) {
    return (
      <div className="h-full w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dev Mode OFF and no data - show CTA (NEVER show mock data in production)
  if (!isDevMode && effectiveProfiles.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="mb-6">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No profiles yet for {schoolName}</h3>
            <p className="text-muted-foreground mb-6">Be the first to join and connect with your classmates!</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full">
              Create your profile
            </Button>
            <Button variant="outline" className="w-full">
              Invite classmates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="p-6 space-y-6">
        {/* Search Header */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search profiles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            Filters
          </Button>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {effectiveProfiles.map((profile) => (
            <div key={profile.user_id || profile.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-semibold text-lg">
                  {profile.display_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{profile.display_name}</h3>
                  <p className="text-sm text-muted-foreground">Class of {profile.class_year}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {profile.bio}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.tags?.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Button className="w-full" size="sm">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverTabContent;