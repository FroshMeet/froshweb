import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, MessageCircle, Phone, Users, ChevronLeft, ChevronRight } from "lucide-react";
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
    // For pass action, always proceed to next profile regardless of guest status
    if (action === 'pass') {
      onSwipeAction(action);
      setCurrentPhotoIndex(0);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
      return;
    }

    // For like action, check guest status
    if (action === 'like' && isGuest && onGuestAction) {
      onGuestAction();
      return;
    }

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
    }
  };

  const prevPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No profiles to show right now</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  if (!currentProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const photos = currentProfile.photos || ["photo-1649972904349-6e44c42644a7"];
  const currentPhoto = photos[currentPhotoIndex];
  const onlineStatus = getOnlineStatus();
  const isLastPhoto = currentPhotoIndex === photos.length - 1;

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col overflow-hidden">
        {/* Toggle Group - Fixed at top */}
        <div className="flex-shrink-0 bg-card px-4 py-2">
          <ToggleGroup 
            type="single" 
            value={meetMode} 
            onValueChange={value => value && setMeetMode && setMeetMode(value)} 
            className="w-full justify-center bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem 
              value="general" 
              className="flex items-center space-x-1 px-3 py-1 text-xs data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground"
            >
              <Heart className="h-3 w-3" />
              <span>General</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="roommate" 
              className="flex items-center space-x-1 px-3 py-1 text-xs data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground"
            >
              <Users className="h-3 w-3" />
              <span>Roommates</span>
            </ToggleGroupItem>
          </ToggleGroup>

          {isGuest && (
            <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-center mt-1">
              Browsing as guest - create an account to message people
            </p>
          )}
        </div>

        {/* Photo Section - Takes remaining space above buttons */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src={getUnsplashUrl(currentPhoto)}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows - Always visible when multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                disabled={currentPhotoIndex === 0}
                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-20 ${
                  currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/90'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextPhoto}
                disabled={currentPhotoIndex === photos.length - 1}
                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-20 ${
                  currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/90'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-1 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Profile info overlay - ONLY on last photo for mobile */}
          {isLastPhoto && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 text-white">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                <div className="flex items-center text-sm space-x-3">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{currentProfile.major}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentProfile.location}</span>
                  </div>
                </div>
                <p className="text-sm line-clamp-3">{currentProfile.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests?.slice(0, 4).map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs px-2 py-0.5 bg-white/20 text-white border-white/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">LOOKING FOR</p>
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.lookingFor?.map((item: string) => (
                      <Badge key={item} className="text-xs bg-purple-600/80 text-white px-2 py-0.5">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Class Year and Online Status - Always visible */}
          <div className="absolute top-16 right-4 flex flex-col gap-1 z-10">
            <Badge className="bg-white/90 text-black text-xs px-2 py-0.5">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
            <div className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full ${onlineStatus.color}`} />
              <span className="text-xs text-black">{onlineStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 bg-card px-4 py-3 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-red-50 hover:border-red-200 h-10"
            onClick={() => handleSwipe('pass')}
          >
            <X className="h-4 w-4 mr-1" />
            Pass
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10"
            onClick={() => setShowIcebreakers(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
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

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full overflow-hidden">
        {/* Desktop Toggle - Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          {setMeetMode && (
            <ToggleGroup 
              type="single" 
              value={meetMode} 
              onValueChange={value => value && setMeetMode(value)} 
              className="bg-card/90 backdrop-blur-sm rounded-lg p-1"
            >
              <ToggleGroupItem 
                value="general" 
                className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground"
              >
                <Heart className="h-4 w-4" />
                <span>General</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="roommate" 
                className="flex items-center space-x-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground text-muted-foreground"
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
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                disabled={currentPhotoIndex === 0}
                className={`absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-20 ${
                  currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/90'
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextPhoto}
                disabled={currentPhotoIndex === photos.length - 1}
                className={`absolute right-6 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-20 ${
                  currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/90'
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-1.5 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Class Year and Online Status */}
          <div className="absolute top-20 right-6 flex flex-col gap-2 z-10">
            <Badge className="bg-white/90 text-black">
              Class of {currentProfile.classOf || "2029"}
            </Badge>
            <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${onlineStatus.color}`} />
              <span className="text-sm text-black">{onlineStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Right side - Profile Info (ALWAYS visible on desktop) */}
        <div className="w-80 bg-card flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
              <div className="flex items-center text-muted-foreground text-sm space-x-3 mt-1">
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

            <div>
              <p className="text-sm text-muted-foreground">
                {currentProfile.bio}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests?.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs px-2 py-0.5">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">LOOKING FOR</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.lookingFor?.map((item: string) => (
                    <Badge key={item} className="text-xs bg-primary/10 text-primary px-2 py-0.5">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 space-y-3 border-t">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11"
              onClick={() => setShowIcebreakers(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-red-50 hover:border-red-200 h-11"
                onClick={() => handleSwipe('pass')}
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-11"
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
