
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageSquare, MapPin, BookOpen, RotateCcw } from "lucide-react";

const SwipeCards = ({ profiles, onShowIcebreakers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=600&fit=crop&crop=face`;
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
      setSwipeDirection(null);
    }, 300);
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Heart className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No more profiles!</h3>
        <p className="text-slate-600 mb-6">Check back later for new people to connect with.</p>
        <Button 
          onClick={() => setCurrentIndex(0)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto relative">
      <div className="text-center mb-6">
        <p className="text-slate-600">Swipe right to connect, left to pass</p>
      </div>

      {/* Card Stack */}
      <div className="relative h-[500px] mb-6">
        {/* Background cards for depth */}
        {profiles.slice(currentIndex + 1, currentIndex + 3).map((_, index) => (
          <Card 
            key={index}
            className={`absolute inset-0 bg-white shadow-xl transform transition-transform duration-300`}
            style={{
              transform: `scale(${0.95 - index * 0.05}) translateY(${index * 4}px)`,
              zIndex: 2 - index
            }}
          />
        ))}

        {/* Main card */}
        <Card 
          className={`absolute inset-0 bg-white shadow-2xl cursor-grab active:cursor-grabbing transform transition-all duration-300 overflow-hidden ${
            swipeDirection === 'left' ? '-translate-x-full rotate-12 opacity-0' :
            swipeDirection === 'right' ? 'translate-x-full -rotate-12 opacity-0' : ''
          }`}
          style={{ zIndex: 3 }}
        >
          {/* Profile Image */}
          <div className="relative h-80">
            <img
              src={getUnsplashUrl(currentProfile.photos[0])}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Class badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-slate-800 font-semibold">
                Class of {currentProfile.classOf || "2029"}
              </Badge>
            </div>

            {/* Name and age */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-white mb-1">
                {currentProfile.name}, {currentProfile.age}
              </h3>
              <div className="flex items-center text-white/90 text-sm space-x-4">
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
          </div>

          <CardContent className="p-6">
            <p className="text-slate-700 mb-4 leading-relaxed">
              {currentProfile.bio}
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 tracking-wide">INTERESTS</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.slice(0, 4).map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs border-slate-300 text-slate-700">
                      {interest}
                    </Badge>
                  ))}
                  {currentProfile.interests.length > 4 && (
                    <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
                      +{currentProfile.interests.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 tracking-wide">LOOKING FOR</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.lookingFor.map((item) => (
                    <Badge key={item} className="text-xs bg-slate-900 text-white">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full border-2 border-slate-300 hover:border-red-300 hover:bg-red-50 transition-colors duration-200"
        >
          <X className="h-6 w-6 text-slate-600" />
        </Button>
        
        <Button
          size="lg"
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Heart className="h-6 w-6 text-white" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={onShowIcebreakers}
          className="w-16 h-16 rounded-full border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
        >
          <MessageSquare className="h-6 w-6 text-slate-600" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          {currentIndex + 1} of {profiles.length}
        </p>
      </div>
    </div>
  );
};

export default SwipeCards;
