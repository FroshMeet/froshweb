
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, MessageCircle, Phone } from "lucide-react";
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

  const getOnlineStatus = () => {
    const statuses = [
      { text: "Online now", color: "bg-green-500" },
      { text: "Online 5 min ago", color: "bg-yellow-500" },
      { text: "Not online recently", color: "bg-gray-500" }
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleSwipe = (action: 'like' | 'pass') => {
    onSwipeAction(action);
    setCurrentPhotoIndex(0);
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

  const handlePhotoTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // If tap is on right half, go to next photo; if left half, go to previous
    if (x > width / 2) {
      nextPhoto();
    } else {
      prevPhoto();
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-600">No profiles to show right now</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  if (!currentProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  const photos = currentProfile.photos || ["photo-1649972904349-6e44c42644a7"];
  const currentPhoto = photos[currentPhotoIndex];
  const onlineStatus = getOnlineStatus();

  return (
    <div className="h-full overflow-hidden">
      {/* Mobile Layout - Full Screen Profile */}
      <div className="md:hidden h-full flex flex-col">
        {/* Photo Section - Takes most space but leaves room for content */}
        <div className="flex-1 relative min-h-0">
          <img
            src={getUnsplashUrl(currentPhoto)}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={handlePhotoTap}
          />
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Class Year and Online Status */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Badge className="bg-white/90 text-black text-sm">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
            <div className="flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${onlineStatus.color}`} />
              <span className="text-xs text-black">{onlineStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Profile Info Section - Compact but visible */}
        <div className="flex-shrink-0 bg-white p-4 space-y-3">
          {/* Name and Basic Info */}
          <div>
            <h3 className="text-xl font-bold">{currentProfile.name || "Unknown"}, {currentProfile.age || "18"}</h3>
            <div className="flex items-center text-muted-foreground text-sm space-x-4 mt-1">
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

          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentProfile.bio || "No bio available"}
          </p>

          {/* Social Media */}
          {(currentProfile.instagramPublic || currentProfile.snapchatPublic || currentProfile.phonePublic) && (
            <div className="flex flex-wrap gap-2">
              {currentProfile.instagramPublic && currentProfile.instagram && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Instagram className="h-3 w-3" />
                  {currentProfile.instagram}
                </Badge>
              )}
              {currentProfile.snapchatPublic && currentProfile.snapchat && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <MessageCircle className="h-3 w-3" />
                  {currentProfile.snapchat}
                </Badge>
              )}
              {currentProfile.phonePublic && currentProfile.phoneNumber && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3" />
                  {currentProfile.phoneNumber}
                </Badge>
              )}
            </div>
          )}

          {/* Interests and Looking For - Compact */}
          <div className="space-y-2">
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

            <div className="flex flex-wrap gap-1">
              {currentProfile.lookingFor?.map((item: string) => (
                <Badge key={item} className="text-xs bg-purple-100 text-purple-700">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 hover:bg-red-50 hover:border-red-200"
              onClick={() => handleSwipe('pass')}
            >
              <X className="h-4 w-4 mr-1" />
              Pass
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setShowIcebreakers(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              onClick={() => handleSwipe('like')}
            >
              <Heart className="h-4 w-4 mr-1" />
              Like
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Photo left, Info right, Buttons bottom */}
      <div className="hidden md:flex h-full">
        <div className="flex-1 flex">
          {/* Left side - Photo */}
          <div className="flex-1 relative">
            <img
              src={getUnsplashUrl(currentPhoto)}
              alt={currentProfile.name || "Profile"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handlePhotoTap}
            />
            
            {/* Photo indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Class Year and Online Status */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <Badge className="bg-white/90 text-black text-base px-4 py-2">
                Class of {currentProfile.classOf || "2029"}
              </Badge>
              <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full">
                <div className={`w-3 h-3 rounded-full ${onlineStatus.color}`} />
                <span className="text-sm text-black">{onlineStatus.text}</span>
              </div>
            </div>
          </div>

          {/* Right side - Info and Buttons */}
          <div className="w-96 bg-white flex flex-col">
            {/* Profile Info - Scrollable if needed */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-2xl font-bold">{currentProfile.name || "Unknown"}, {currentProfile.age || "18"}</h3>
                <div className="flex items-center text-muted-foreground text-base space-x-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{currentProfile.major || "Undeclared"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{currentProfile.location || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {currentProfile.bio || "No bio available"}
              </p>

              {/* Public Social Media */}
              {(currentProfile.instagramPublic || currentProfile.snapchatPublic || currentProfile.phonePublic) && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-2">CONNECT</p>
                  <div className="flex flex-wrap gap-3">
                    {currentProfile.instagramPublic && currentProfile.instagram && (
                      <Badge variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
                        <Instagram className="h-4 w-4" />
                        {currentProfile.instagram}
                      </Badge>
                    )}
                    {currentProfile.snapchatPublic && currentProfile.snapchat && (
                      <Badge variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
                        <MessageCircle className="h-4 w-4" />
                        {currentProfile.snapchat}
                      </Badge>
                    )}
                    {currentProfile.phonePublic && currentProfile.phoneNumber && (
                      <Badge variant="outline" className="flex items-center gap-2 text-sm px-3 py-2">
                        <Phone className="h-4 w-4" />
                        {currentProfile.phoneNumber}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">INTERESTS</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests?.map((interest: string) => (
                      <Badge key={interest} variant="outline" className="text-sm px-3 py-1">
                        {interest}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">No interests listed</span>}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">LOOKING FOR</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.lookingFor?.map((item: string) => (
                      <Badge key={item} className="text-sm bg-purple-100 text-purple-700 px-3 py-1">
                        {item}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">Not specified</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 p-6 space-y-4 border-t">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-base"
                onClick={() => setShowIcebreakers(true)}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </Button>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-red-50 hover:border-red-200 h-12 text-base"
                  onClick={() => handleSwipe('pass')}
                >
                  <X className="h-5 w-5 mr-2" />
                  Pass
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-12 text-base"
                  onClick={() => handleSwipe('like')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Like
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
