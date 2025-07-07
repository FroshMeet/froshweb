
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageSquare, MapPin, BookOpen, Instagram, Phone, User, MessageCircle } from "lucide-react";
import IcebreakerModal from "./IcebreakerModal";

const DiscoverGrid = ({ profiles, isGuest = false, onGuestAction }: { profiles: any[], isGuest?: boolean, onGuestAction?: () => void }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null);

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=400&fit=crop&crop=face`;
  };

  const getSchoolColors = (college) => {
    const colors = {
      "UCLA": "border-blue-500",
      "Harvard University": "border-red-700",
      "Stanford University": "border-red-600",
      "MIT": "border-gray-700",
      "UC Berkeley": "border-blue-700",
      "Arizona State University": "border-yellow-500"
    };
    return colors[college] || "border-blue-600";
  };

  const handleMessage = (profile) => {
    setMessageTarget(profile);
    setShowIcebreakers(true);
  };

  const handleSendMessage = (message: string) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    console.log("Sending message:", message, "to", messageTarget?.name);
  };

  const handleLike = (profile) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    console.log("Liked profile:", profile.name);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 bg-card/90 backdrop-blur-sm border-4 ${getSchoolColors(profile.college)} overflow-hidden`}
            onClick={() => setSelectedProfile(profile)}
          >
            <div className="relative aspect-square">
              <img
                src={getUnsplashUrl(profile.photos?.[0] || "photo-1649972904349-6e44c42644a7")}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              
              {/* Class Year Badge */}
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-background/90 text-foreground font-bold text-sm px-2 py-1">
                  {profile.classOf || "2029"}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Detail Modal */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">{selectedProfile.name}'s Profile</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={getUnsplashUrl(selectedProfile.photos?.[0] || "photo-1649972904349-6e44c42644a7")}
                    alt={selectedProfile.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">{selectedProfile.major}</span>
                    </div>
                    {selectedProfile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedProfile.location}</span>
                      </div>
                    )}
                  </div>
                  <Badge className="mb-4 text-lg px-3 py-1">Class of {selectedProfile.classOf || "2029"}</Badge>
                </div>

                <div>
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">{selectedProfile.bio}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-muted-foreground mb-3 tracking-wide">INTERESTS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests?.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-sm py-1 px-3">
                          {interest}
                        </Badge>
                      )) || <span className="text-sm text-muted-foreground">No interests listed</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-muted-foreground mb-3 tracking-wide">LOOKING FOR</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.lookingFor?.map((item) => (
                        <Badge key={item} className="text-sm bg-primary text-primary-foreground py-1 px-3">
                          {item}
                        </Badge>
                      )) || <span className="text-sm text-muted-foreground">Not specified</span>}
                    </div>
                  </div>

                  {/* Public Social Media */}
                  {(selectedProfile.instagramPublic && selectedProfile.instagram) ||
                   (selectedProfile.snapchatPublic && selectedProfile.snapchat) ||
                   (selectedProfile.phonePublic && selectedProfile.phoneNumber) ? (
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-3 tracking-wide">CONNECT</p>
                      <div className="space-y-3">
                        {selectedProfile.instagramPublic && selectedProfile.instagram && (
                          <div className="flex items-center space-x-3 text-sm">
                            <Instagram className="h-5 w-5 text-pink-500" />
                            <span className="font-semibold">{selectedProfile.instagram}</span>
                          </div>
                        )}
                        {selectedProfile.snapchatPublic && selectedProfile.snapchat && (
                          <div className="flex items-center space-x-3 text-sm">
                            <MessageCircle className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold">{selectedProfile.snapchat}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex space-x-3 pt-6">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="flex-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                    onClick={() => handleLike(selectedProfile)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Like
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                    onClick={() => handleMessage(selectedProfile)}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <IcebreakerModal
        isOpen={showIcebreakers}
        onClose={() => {
          setShowIcebreakers(false);
          setMessageTarget(null);
        }}
        onSendMessage={handleSendMessage}
        targetName={messageTarget?.name}
        isGuest={isGuest}
        onGuestAction={onGuestAction}
      />
    </div>
  );
};

export default DiscoverGrid;
