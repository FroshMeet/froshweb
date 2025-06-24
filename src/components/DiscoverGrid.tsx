
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageSquare, MapPin, BookOpen, Instagram, Phone } from "lucide-react";

const DiscoverGrid = ({ profiles }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=300&h=400&fit=crop&crop=face`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Discover Students</h2>
        <p className="text-slate-600">Browse profiles and connect with fellow students</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            onClick={() => setSelectedProfile(profile)}
          >
            <div className="relative">
              <img
                src={getUnsplashUrl(profile.photos[0])}
                alt={profile.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/90 text-slate-800 font-semibold">
                  Class of {profile.classOf || "2028"}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-3">
              <h3 className="font-bold text-slate-800 mb-1">{profile.name}, {profile.age}</h3>
              <p className="text-sm text-slate-600 mb-2">{profile.major}</p>
              <div className="flex flex-wrap gap-1">
                {profile.interests.slice(0, 2).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.interests.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Detail Modal */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-md">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">{selectedProfile.name}'s Profile</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={getUnsplashUrl(selectedProfile.photos[0])}
                    alt={selectedProfile.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h3>
                  <div className="flex items-center text-slate-600 text-sm space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{selectedProfile.major}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedProfile.location}</span>
                    </div>
                  </div>
                  <Badge className="mb-3">Class of {selectedProfile.classOf || "2028"}</Badge>
                </div>

                <div>
                  <p className="text-slate-700 mb-4">{selectedProfile.bio}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2 tracking-wide">INTERESTS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2 tracking-wide">LOOKING FOR</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.lookingFor.map((item) => (
                        <Badge key={item} className="text-xs bg-slate-900 text-white">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Public Social Media */}
                  {(selectedProfile.instagramPublic && selectedProfile.instagram) ||
                   (selectedProfile.snapchatPublic && selectedProfile.snapchat) ||
                   (selectedProfile.phonePublic && selectedProfile.phoneNumber) ? (
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2 tracking-wide">CONNECT</p>
                      <div className="space-y-2">
                        {selectedProfile.instagramPublic && selectedProfile.instagram && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Instagram className="h-4 w-4" />
                            <span>{selectedProfile.instagram}</span>
                          </div>
                        )}
                        {selectedProfile.snapchatPublic && selectedProfile.snapchat && (
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <span>{selectedProfile.snapchat}</span>
                          </div>
                        )}
                        {selectedProfile.phonePublic && selectedProfile.phoneNumber && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4" />
                            <span>{selectedProfile.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex space-x-2 pt-4">
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
                    className="flex-1 bg-slate-900 hover:bg-slate-800"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscoverGrid;
