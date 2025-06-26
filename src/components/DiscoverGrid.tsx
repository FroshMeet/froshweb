
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
    return `https://images.unsplash.com/${photoId}?w=300&h=400&fit=crop&crop=face`;
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Discover Students</h2>
        <p className="text-slate-600 text-lg">Browse profiles and connect with fellow students</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 bg-white/90 backdrop-blur-sm"
            onClick={() => setSelectedProfile(profile)}
          >
            <div className="relative">
              {/* Cover Photo */}
              <img
                src={getUnsplashUrl(profile.photos?.[0] || "photo-1649972904349-6e44c42644a7")}
                alt={profile.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              
              {/* Profile Picture with School Color Border */}
              <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 ${getSchoolColors(profile.college)} bg-white p-0.5`}>
                {profile.photos?.[0] ? (
                  <img
                    src={getUnsplashUrl(profile.photos[0])}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className="pt-8 pb-3 text-center">
              {/* Class Year */}
              <Badge className="bg-slate-900 text-white font-bold">
                {profile.classOf || "2029"}
              </Badge>
            </CardContent>
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
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h3>
                  <div className="flex items-center text-slate-600 text-sm space-x-4 mb-4">
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
                  <p className="text-slate-700 mb-6 text-base leading-relaxed">{selectedProfile.bio}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3 tracking-wide">INTERESTS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests?.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-sm py-1 px-3">
                          {interest}
                        </Badge>
                      )) || <span className="text-sm text-slate-500">No interests listed</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-3 tracking-wide">LOOKING FOR</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.lookingFor?.map((item) => (
                        <Badge key={item} className="text-sm bg-slate-900 text-white py-1 px-3">
                          {item}
                        </Badge>
                      )) || <span className="text-sm text-slate-500">Not specified</span>}
                    </div>
                  </div>

                  {/* Public Social Media */}
                  {(selectedProfile.instagramPublic && selectedProfile.instagram) ||
                   (selectedProfile.snapchatPublic && selectedProfile.snapchat) ||
                   (selectedProfile.phonePublic && selectedProfile.phoneNumber) ? (
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-3 tracking-wide">CONNECT</p>
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
                    className="flex-1 bg-slate-900 hover:bg-slate-800 transition-all duration-200"
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
