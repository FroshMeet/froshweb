
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, MessageCircle, Phone } from "lucide-react";

interface SwipeCardsProps {
  profiles: any[];
  onShowIcebreakers: () => void;
  onSwipeAction: (action: string) => void;
}

const SwipeCards = ({ profiles, onShowIcebreakers, onSwipeAction }: SwipeCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=500&fit=crop&crop=face`;
  };

  const handleSwipe = (action: 'like' | 'pass') => {
    onSwipeAction(action);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No profiles to show right now</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="max-w-sm mx-auto">
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="relative">
          <img
            src={getUnsplashUrl(currentProfile.photos?.[0] || "photo-1649972904349-6e44c42644a7")}
            alt={currentProfile.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-black">
              Class of {currentProfile.classOf}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
              <div className="flex items-center text-muted-foreground text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{currentProfile.major}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentProfile.location}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {currentProfile.bio}
            </p>

            {/* Public Social Media */}
            {(currentProfile.instagramPublic || currentProfile.snapchatPublic || currentProfile.phonePublic) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">CONNECT</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.instagramPublic && currentProfile.instagram && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Instagram className="h-3 w-3" />
                      {currentProfile.instagram}
                    </Badge>
                  )}
                  {currentProfile.snapchatPublic && currentProfile.snapchat && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {currentProfile.snapchat}
                    </Badge>
                  )}
                  {currentProfile.phonePublic && currentProfile.phoneNumber && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {currentProfile.phoneNumber}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">INTERESTS</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests?.slice(0, 4).map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {currentProfile.interests?.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{currentProfile.interests.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">LOOKING FOR</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.lookingFor?.map((item: string) => (
                    <Badge key={item} className="text-xs bg-purple-100 text-purple-700">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 hover:bg-red-50 hover:border-red-200"
                onClick={() => handleSwipe('pass')}
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => handleSwipe('like')}
              >
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwipeCards;
