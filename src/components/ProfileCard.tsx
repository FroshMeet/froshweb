
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, User, MapPin, BookOpen, Instagram, MessageCircle, Phone } from "lucide-react";

const ProfileCard = ({ profile, isOwnProfile = false }) => {
  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=500&fit=crop&crop=face`;
  };

  // Handle case where photos might be undefined or empty
  const profilePhoto = profile?.photos?.[0];
  const hasProfilePhoto = profilePhoto && profilePhoto !== "";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {hasProfilePhoto ? (
          <img
            src={getUnsplashUrl(profilePhoto)}
            alt={profile?.name || "Profile"}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <User className="h-16 w-16 text-slate-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-black">
            Class of {profile?.classOf || "2029"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold">{profile?.name || "Unknown"}, {profile?.age || "18"}</h3>
            <div className="flex items-center text-muted-foreground text-sm space-x-4">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{profile?.major || "Undeclared"}</span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile?.bio || "No bio available"}
          </p>

          {/* Public Social Media */}
          {(profile?.instagramPublic || profile?.snapchatPublic || profile?.phonePublic) && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">CONNECT</p>
              <div className="flex flex-wrap gap-2">
                {profile?.instagramPublic && profile?.instagram && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Instagram className="h-3 w-3" />
                    {profile.instagram}
                  </Badge>
                )}
                {profile?.snapchatPublic && profile?.snapchat && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {profile.snapchat}
                  </Badge>
                )}
                {profile?.phonePublic && profile?.phoneNumber && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {profile.phoneNumber}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">INTERESTS</p>
              <div className="flex flex-wrap gap-1">
                {profile?.interests?.slice(0, 4).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                )) || <span className="text-xs text-muted-foreground">No interests listed</span>}
                {profile?.interests?.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.interests.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">LOOKING FOR</p>
              <div className="flex flex-wrap gap-1">
                {profile?.lookingFor?.map((item) => (
                  <Badge key={item} className="text-xs bg-purple-100 text-purple-700">
                    {item}
                  </Badge>
                )) || <span className="text-xs text-muted-foreground">Not specified</span>}
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 hover:bg-red-50 hover:border-red-200"
              >
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
