import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, User, ChevronLeft, ChevronRight, MapPin, BookOpen } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  age: number;
  major: string;
  location: string;
  bio: string;
  interests: string[];
  lookingFor: string[];
  photos: string[];
  classOf: string;
}

// Mock data for guest browsing
const MOCK_PROFILES: Profile[] = [
  {
    id: "1",
    name: "Emma",
    age: 18,
    major: "Computer Science",
    location: "Bay Area, CA",
    bio: "Love coding, hiking, and trying new coffee shops! Looking forward to meeting people who share similar interests.",
    interests: ["Coding", "Hiking", "Coffee", "Gaming"],
    lookingFor: ["Study buddies", "Friends", "Activity partners"],
    photos: ["photo-1494790108755-2616b612b786", "photo-1517841905240-472988babdf9"],
    classOf: "2029"
  },
  {
    id: "2", 
    name: "Alex",
    age: 19,
    major: "Business Administration",
    location: "Los Angeles, CA",
    bio: "Entrepreneur mindset, love sports and meeting new people. Always down for adventures!",
    interests: ["Basketball", "Entrepreneurship", "Travel", "Music"],
    lookingFor: ["Roommates", "Business partners", "Friends"],
    photos: ["photo-1507003211169-0a1dd7228f2d", "photo-1500648767791-00dcc994a43e"],
    classOf: "2028"
  },
  {
    id: "3",
    name: "Sarah",
    age: 18,
    major: "Psychology", 
    location: "San Diego, CA",
    bio: "Psychology major with a passion for helping others. Love reading, yoga, and deep conversations.",
    interests: ["Psychology", "Yoga", "Reading", "Volunteering"],
    lookingFor: ["Study groups", "Friends", "Mentorship"],
    photos: ["photo-1438761681033-6461ffad8d80", "photo-1544005313-94ddf0286df2"],
    classOf: "2029"
  },
  {
    id: "4",
    name: "Marcus",
    age: 19,
    major: "Engineering",
    location: "San Francisco, CA",
    bio: "Engineering student who loves building things and solving problems. Also into photography!",
    interests: ["Engineering", "Photography", "Problem solving", "Tech"],
    lookingFor: ["Project partners", "Friends", "Study buddies"],
    photos: ["photo-1472099645785-5658abf4ff4e", "photo-1506794778202-cad84cf45f5"],
    classOf: "2028"
  }
];

interface PublicProfileBrowserProps {
  onGuestAction: () => void;
  isMobile?: boolean;
}

export default function PublicProfileBrowser({ onGuestAction, isMobile = false }: PublicProfileBrowserProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=600&fit=crop&crop=face`;
  };

  const nextProfile = () => {
    setCurrentPhotoIndex(0);
    setCurrentIndex((prev) => (prev + 1) % MOCK_PROFILES.length);
  };

  const prevProfile = () => {
    setCurrentPhotoIndex(0);
    setCurrentIndex((prev) => (prev - 1 + MOCK_PROFILES.length) % MOCK_PROFILES.length);
  };

  const nextPhoto = () => {
    const profile = MOCK_PROFILES[currentIndex];
    if (currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const currentProfile = MOCK_PROFILES[currentIndex];
  const currentPhoto = currentProfile.photos[currentPhotoIndex];

  if (isMobile) {
    // Mobile swipe-like interface
    return (
      <div className="h-full w-full overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Photo Section */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={getUnsplashUrl(currentPhoto)}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows for photos */}
            {currentProfile.photos.length > 1 && (
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
                  disabled={currentPhotoIndex === currentProfile.photos.length - 1}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-20 ${
                    currentPhotoIndex === currentProfile.photos.length - 1 ? 'opacity-30' : 'hover:bg-black/90'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Photo indicators */}
            {currentProfile.photos.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                {currentProfile.photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-1 rounded-full ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Profile info overlay */}
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
                <p className="text-sm line-clamp-2">{currentProfile.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs px-2 py-0.5 bg-white/20 text-white border-white/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Class Year */}
            <div className="absolute top-16 right-4 z-10">
              <Badge className="bg-white/90 text-black text-xs px-2 py-0.5">
                Class of {currentProfile.classOf}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 bg-card px-4 py-3 flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 h-10"
              onClick={prevProfile}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10"
              onClick={onGuestAction}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Button 
              className="flex-1 h-10"
              onClick={nextProfile}
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop grid interface
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Preview of profiles - create an account to see more and unlock full features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROFILES.map((profile) => (
          <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={getUnsplashUrl(profile.photos[0])}
                alt={profile.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/90 text-primary-foreground">
                  Class of {profile.classOf}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                  <div className="flex items-center text-muted-foreground text-sm space-x-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{profile.major}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {profile.bio}
                </p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">INTERESTS</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.slice(0, 3).map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.interests.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">LOOKING FOR</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.lookingFor.slice(0, 2).map((item) => (
                        <Badge key={item} className="text-xs bg-primary/20 text-primary">
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
                    className="flex-1"
                    onClick={onGuestAction}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={onGuestAction}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button onClick={onGuestAction} className="bg-primary hover:bg-primary/90">
          Join FroshMeet to See More Profiles
        </Button>
      </div>
    </div>
  );
}