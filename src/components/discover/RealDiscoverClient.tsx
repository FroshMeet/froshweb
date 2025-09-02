"use client";

// IMPORTANT: All Supabase imports/hooks go here, NOT in ClientShell or other components.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProfiles, Profile } from "@/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileDetailModal } from "@/components/ProfileDetailModal";

interface RealDiscoverClientProps {
  schoolName?: string;
  schoolSlug?: string;
}

export default function RealDiscoverClient({ schoolName, schoolSlug }: RealDiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { profiles, loading, fetchProfiles } = useProfiles(schoolSlug || '');

  // Filter profiles by search query
  const filteredProfiles = profiles.filter(profile =>
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

  // Show loading state for real data
  if (loading && profiles.length === 0) {
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

  // No data - show CTA
  if (filteredProfiles.length === 0 && !loading) {
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

        {/* Load More Button */}
        {profiles.length > 0 && profiles.length % 24 === 0 && (
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
      </div>

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
}