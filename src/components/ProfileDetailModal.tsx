import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, UserPlus, Heart, X, Camera } from "lucide-react";
import { Profile, useFriendRequests, useMessages } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";

interface ProfileDetailModalProps {
  profile: Profile | null;
  open: boolean;
  onClose: () => void;
}

export const ProfileDetailModal = ({ profile, open, onClose }: ProfileDetailModalProps) => {
  const [friendshipStatus, setFriendshipStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'friends'>('none');
  const [isLoading, setIsLoading] = useState(false);
  
  const { sendFriendRequest, getFriendshipStatus } = useFriendRequests();
  const { sendMessage } = useMessages();
  const { toast } = useToast();

  useEffect(() => {
    if (profile && open) {
      getFriendshipStatus(profile.user_id).then(setFriendshipStatus);
    }
  }, [profile, open, getFriendshipStatus]);

  const handleAddFriend = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    const result = await sendFriendRequest(profile.user_id);
    if (result.success) {
      setFriendshipStatus('pending_sent');
    }
    setIsLoading(false);
  };

  const handleMessage = () => {
    if (!profile) return;
    
    // For now, just show a toast. In a real implementation, 
    // this would navigate to a message interface or open a message modal
    toast({
      title: "Message Feature",
      description: `Starting conversation with ${profile.full_name}...`
    });
  };

  const getFriendButtonText = () => {
    switch (friendshipStatus) {
      case 'friends':
        return 'Friends';
      case 'pending_sent':
        return 'Requested';
      case 'pending_received':
        return 'Accept Request';
      default:
        return 'Add Friend';
    }
  };

  const getFriendButtonVariant = () => {
    switch (friendshipStatus) {
      case 'friends':
        return 'secondary';
      case 'pending_sent':
        return 'outline';
      case 'pending_received':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <h2>{profile.full_name}'s Profile</h2>
        </DialogHeader>
        
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary to-primary/80 rounded-lg overflow-hidden relative">
            {profile.cover_url ? (
              <img 
                src={profile.cover_url} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
            )}
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Picture - Overlapping */}
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
              {profile.pfp_url ? (
                <img 
                  src={profile.pfp_url} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="text-sm text-muted-foreground">Class of {profile.class_year}</p>
              {profile.school_name && (
                <p className="text-sm text-muted-foreground">{profile.school_name}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={getFriendButtonVariant()}
                size="sm"
                onClick={handleAddFriend}
                disabled={isLoading || friendshipStatus === 'friends' || friendshipStatus === 'pending_sent'}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {getFriendButtonText()}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Image Gallery */}
          {profile.images && profile.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.images.map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State for Photos */}
          {(!profile.images || profile.images.length === 0) && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No photos yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};