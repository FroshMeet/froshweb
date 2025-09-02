import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDevMode } from "@/components/dev-mode/DevModeProvider";
import { useProfiles, Profile } from "@/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileDetailModal } from "@/components/ProfileDetailModal";
import DevModeToggle from "@/components/dev-mode/DevModeToggle";

interface DiscoverTabContentProps {
  schoolName?: string;
  schoolSlug?: string;
}

const DiscoverTabContent = ({ schoolName, schoolSlug }: DiscoverTabContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { devMode, hydrated } = useDevMode();
  const { profiles, loading, fetchProfiles } = useProfiles(schoolSlug || '');
  
  // Mock profiles for dev mode preview
  const mockProfiles: Profile[] = [
    {
      id: "mock-1",
      user_id: "mock-user-1",
      username: "alex_johnson",
      full_name: "Alex Johnson",
      class_year: 2028,
      bio: "Pre-med student passionate about research and community service. Looking to connect with study partners and make lifelong friendships!",
      pfp_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      cover_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=300&fit=crop",
      school_slug: schoolSlug || "",
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
      ]
    },
    {
      id: "mock-2",
      user_id: "mock-user-2", 
      username: "sam_chen",
      full_name: "Sam Chen",
      class_year: 2028,
      bio: "CS major interested in AI/ML and full-stack development. Love hiking, photography, and discovering new coffee shops around campus!",
      pfp_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      cover_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=300&fit=crop",
      school_slug: schoolSlug || "",
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face"
      ]
    },
    {
      id: "mock-3",
      user_id: "mock-user-3",
      username: "jordan_taylor", 
      full_name: "Jordan Taylor",
      class_year: 2027,
      bio: "Business major and entrepreneur. Currently working on a startup idea and looking for co-founders. Also love playing intramural sports!",
      pfp_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      cover_url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=300&fit=crop",
      school_slug: schoolSlug || "",
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face"
      ]
    },
    {
      id: "mock-4",
      user_id: "mock-user-4",
      username: "riley_martinez",
      full_name: "Riley Martinez", 
      class_year: 2028,
      bio: "Psychology major passionate about mental health advocacy and research. Love painting, yoga, and volunteering at local shelters.",
      pfp_url: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=400&h=400&fit=crop&crop=face",
      cover_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=300&fit=crop",
      school_slug: schoolSlug || "",
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
      ]
    },
    {
      id: "mock-5",
      user_id: "mock-user-5",
      username: "casey_park",
      full_name: "Casey Park",
      class_year: 2029,
      bio: "Engineering student who loves building things and solving problems. Play guitar in my free time and always down for late-night coding sessions!",
      pfp_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", 
      cover_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop",
      school_slug: schoolSlug || "",
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      ]
    }
  ];

  // Use mock profiles in dev mode, real profiles otherwise
  const displayProfiles = devMode ? mockProfiles : profiles;
  
  // Filter profiles by search query
  const filteredProfiles = displayProfiles.filter(profile =>
    profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleLoadMore = () => {
    fetchProfiles(24, profiles.length);
  };

  // Show loading state only for real data (and only when hydrated)
  if (!hydrated) {
    return <div className="h-full w-full" />; // Prevent hydration mismatch
  }

  if (!devMode && loading && profiles.length === 0) {
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
  if (!devMode && filteredProfiles.length === 0 && !loading) {
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
              Be the First Posted!
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
          {filteredProfiles.map((profile) => (
            <div 
              key={profile.id} 
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProfileClick(profile)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                  {profile.pfp_url ? (
                    <img src={profile.pfp_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">Class of {profile.class_year}</p>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {profile.bio}
                </p>
              )}

              {/* Show image thumbnails if available */}
              {profile.images && profile.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {profile.images.slice(0, 3).map((imageUrl, index) => (
                    <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <Button className="w-full" size="sm">
                View Profile
              </Button>
            </div>
          ))}
        </div>

        {/* Load More Button - only for real profiles */}
        {!devMode && profiles.length > 0 && profiles.length % 24 === 0 && (
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {/* Dev Mode Banner */}
        {devMode && filteredProfiles.length > 0 && (
          <div className="flex justify-center pt-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2">
              <p className="text-sm text-yellow-400">
                🔧 Dev Mode is ON — showing mock profiles & all group chats.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dev Mode Toggle */}
      <DevModeToggle />

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        open={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedProfile(null);
        }}
      />
    </div>
  );
};

export default DiscoverTabContent;