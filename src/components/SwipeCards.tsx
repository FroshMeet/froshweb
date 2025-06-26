
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, MessageCircle, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import IcebreakerModal from "./IcebreakerModal";

interface SwipeCardsProps {
  profiles: any[];
  onShowIcebreakers: () => void;
  onSwipeAction: (action: string) => void;
  isGuest?: boolean;
  onGuestAction?: () => void;
}

const SwipeCards = ({ profiles, onShowIcebreakers, onSwipeAction, isGuest = false, onGuestAction }: SwipeCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=600&fit=crop&crop=face`;
  };

  const handleSwipe = (action: 'like' | 'pass') => {
    onSwipeAction(action);
    setCurrentPhotoIndex(0); // Reset photo index when switching profiles
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleSendMessage = (message: string) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    console.log("Sending message:", message, "to", currentProfile?.name);
  };

  const nextPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const prevPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (currentProfile?.photos) {
      setCurrentPhotoIndex(currentProfile.photos.length - 1);
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

  if (!currentProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  const photos = currentProfile.photos || ["photo-1649972904349-6e44c42644a7"];
  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <Card className="flex-1 overflow-hidden bg-white/80 backdrop-blur-sm flex flex-col">
        {/* Photo Section - Takes most of the screen */}
        <div className="relative flex-1 min-h-[60vh]">
          <img
            src={getUnsplashUrl(currentPhoto)}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={nextPhoto}
          />
          
          {/* Photo Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Photo indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Class Year Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-black">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
          </div>
        </div>
        
        {/* Profile Info Section - Compact but complete */}
        <CardContent className="p-4 bg-white">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{currentProfile.name || "Unknown"}, {currentProfile.age || "18"}</h3>
              <div className="flex items-center text-muted-foreground text-sm space-x-4">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{currentProfile.major || "Undeclared"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentProfile.location || "Unknown"}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {currentProfile.bio || "No bio available"}
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
                  {currentProfile.interests?.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  )) || <span className="text-xs text-muted-foreground">No interests listed</span>}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">LOOKING FOR</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.lookingFor?.map((item: string) => (
                    <Badge key={item} className="text-xs bg-purple-100 text-purple-700">
                      {item}
                    </Badge>
                  )) || <span className="text-xs text-muted-foreground">Not specified</span>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                variant="outline"
                className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                onClick={() => setShowIcebreakers(true)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
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

      <IcebreakerModal
        isOpen={showIcebreakers}
        onClose={() => setShowIcebreakers(false)}
        onSendMessage={handleSendMessage}
        targetName={currentProfile?.name}
        isGuest={isGuest}
        onGuestAction={onGuestAction}
      />
    </div>
  );
};

export default SwipeCards;
