
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, MessageCircle, Phone, Users } from "lucide-react";
import IcebreakerModal from "./IcebreakerModal";

interface SwipeCardsProps {
  profiles: any[];
  onShowIcebreakers: () => void;
  onSwipeAction: (action: string) => void;
  isGuest?: boolean;
  onGuestAction?: () => void;
  meetMode?: string;
  setMeetMode?: (mode: string) => void;
}

const SwipeCards = ({ 
  profiles, 
  onShowIcebreakers, 
  onSwipeAction, 
  isGuest = false, 
  onGuestAction,
  meetMode = "general",
  setMeetMode
}: SwipeCardsProps) => {
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

  const handlePhotoTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x > width / 2) {
      nextPhoto();
    } else {
      prevPhoto();
    }
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
    <div className="h-full w-full overflow-hidden" style={{ height: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col overflow-hidden">
        {/* Photo Section */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <img
            src={getUnsplashUrl(currentPhoto)}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={handlePhotoTap}
            style={{ objectFit: 'cover' }}
          />
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Class Year and Online Status */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            <Badge className="bg-white/90 text-black text-xs px-2 py-0.5">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
            <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full ${onlineStatus.color}`} />
              <span className="text-xs text-black">{onlineStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Profile Info - Compact */}
        <div className="flex-shrink-0 bg-white px-3 py-2 space-y-1 overflow-hidden">
          <div>
            <h3 className="text-base font-bold truncate">{currentProfile.name || "Unknown"}, {currentProfile.age || "18"}</h3>
            <div className="flex items-center text-muted-foreground text-xs space-x-3">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span className="truncate">{currentProfile.major || "Undeclared"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{currentProfile.location || "Unknown"}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {currentProfile.bio || "No bio available"}
          </p>

          {/* Interests and Looking For - Compact */}
          <div className="space-y-1">
            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {currentProfile.interests.slice(0, 4).map((interest: string) => (
                  <Badge key={interest} variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                    {interest}
                  </Badge>
                ))}
                {currentProfile.interests.length > 4 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                    +{currentProfile.interests.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {currentProfile.lookingFor && currentProfile.lookingFor.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {currentProfile.lookingFor.map((item: string) => (
                  <Badge key={item} className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 h-auto">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Social Media - Compact */}
          {(currentProfile.instagramPublic || currentProfile.snapchatPublic || currentProfile.phonePublic) && (
            <div className="flex flex-wrap gap-1">
              {currentProfile.instagramPublic && currentProfile.instagram && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-1.5 py-0.5 h-auto">
                  <Instagram className="h-2.5 w-2.5" />
                  <span className="truncate max-w-16">{currentProfile.instagram}</span>
                </Badge>
              )}
              {currentProfile.snapchatPublic && currentProfile.snapchat && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-1.5 py-0.5 h-auto">
                  <MessageCircle className="h-2.5 w-2.5" />
                  <span className="truncate max-w-16">{currentProfile.snapchat}</span>
                </Badge>
              )}
              {currentProfile.phonePublic && currentProfile.phoneNumber && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-1.5 py-0.5 h-auto">
                  <Phone className="h-2.5 w-2.5" />
                  <span className="truncate max-w-20">{currentProfile.phoneNumber}</span>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white px-3 py-2 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-red-50 hover:border-red-200 h-9 text-sm"
            onClick={() => handleSwipe('pass')}
          >
            <X className="h-4 w-4 mr-1" />
            Pass
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-9 text-sm"
            onClick={() => setShowIcebreakers(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-9 text-sm"
            onClick={() => handleSwipe('like')}
          >
            <Heart className="h-4 w-4 mr-1" />
            Like
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full overflow-hidden">
        {/* Desktop Toggle - Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          {setMeetMode && (
            <ToggleGroup 
              type="single" 
              value={meetMode} 
              onValueChange={value => value && setMeetMode(value)} 
              className="bg-white/90 backdrop-blur-sm rounded-lg p-1"
            >
              <ToggleGroupItem 
                value="general" 
                className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white"
              >
                <Heart className="h-4 w-4" />
                <span>General</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="roommate" 
                className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-slate-900 data-[state=on]:text-white"
              >
                <Users className="h-4 w-4" />
                <span>Roommates</span>
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>

        {/* Left side - Photo */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src={getUnsplashUrl(currentPhoto)}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={handlePhotoTap}
            style={{ objectFit: 'cover' }}
          />
          
          {/* Photo indicators */}
          {photos.length > 1 && (
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
          )}

          {/* Class Year and Online Status */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge className="bg-white/90 text-black">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
            <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${onlineStatus.color}`} />
              <span className="text-sm text-black">{onlineStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Right side - Profile Info */}
        <div className="w-80 bg-white flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4 space-y-3 overflow-hidden">
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

            <div className="max-h-20 overflow-hidden">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentProfile.bio || "No bio available"}
              </p>
            </div>

            {/* Public Social Media */}
            {(currentProfile.instagramPublic || currentProfile.snapchatPublic || currentProfile.phonePublic) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">CONNECT</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.instagramPublic && currentProfile.instagram && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                      <Instagram className="h-3 w-3" />
                      {currentProfile.instagram}
                    </Badge>
                  )}
                  {currentProfile.snapchatPublic && currentProfile.snapchat && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                      <MessageCircle className="h-3 w-3" />
                      {currentProfile.snapchat}
                    </Badge>
                  )}
                  {currentProfile.phonePublic && currentProfile.phoneNumber && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                      <Phone className="h-3 w-3" />
                      {currentProfile.phoneNumber}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                  {currentProfile.interests?.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs px-2 py-0.5">
                      {interest}
                    </Badge>
                  )) || <span className="text-xs text-muted-foreground">No interests listed</span>}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">LOOKING FOR</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.lookingFor?.map((item: string) => (
                    <Badge key={item} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5">
                      {item}
                    </Badge>
                  )) || <span className="text-xs text-muted-foreground">Not specified</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10"
              onClick={() => setShowIcebreakers(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-red-50 hover:border-red-200 h-10"
                onClick={() => handleSwipe('pass')}
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-10"
                onClick={() => handleSwipe('like')}
              >
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
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
