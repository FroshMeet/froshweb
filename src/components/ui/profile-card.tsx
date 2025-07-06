import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, GraduationCap } from "lucide-react";

interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    college: string;
    major: string;
    bio: string;
    interests: string[];
    photos: string[];
    lookingFor: string[];
    location?: string;
  };
  onLike?: () => void;
  onMessage?: () => void;
  isGuest?: boolean;
  onGuestAction?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onLike, 
  onMessage, 
  isGuest, 
  onGuestAction 
}) => {
  const handleAction = (action: () => void) => {
    if (isGuest) {
      onGuestAction?.();
    } else {
      action();
    }
  };

  return (
    <Card className="overflow-hidden bg-card card-shadow-lg border-0 rounded-3xl">
      {/* Photo Section */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-muted/50">
        {profile.photos.length > 0 ? (
          <img 
            src={`https://images.unsplash.com/${profile.photos[0]}?w=400&h=600&fit=crop`}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {profile.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Quick info overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-2xl font-display font-bold mb-1">
            {profile.name}, {profile.age}
          </h3>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <GraduationCap className="w-4 h-4" />
            <span>{profile.major}</span>
          </div>
          {profile.location && (
            <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Bio */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>

        {/* Looking For */}
        <div className="flex flex-wrap gap-2">
          {profile.lookingFor.map((item) => (
            <Badge 
              key={item} 
              variant="secondary" 
              className="bg-primary/10 text-primary border-0 rounded-full px-3 py-1"
            >
              {item}
            </Badge>
          ))}
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 4).map((interest) => (
            <Badge 
              key={interest} 
              variant="outline" 
              className="border-border/50 rounded-full px-3 py-1"
            >
              {interest}
            </Badge>
          ))}
          {profile.interests.length > 4 && (
            <Badge variant="outline" className="border-border/50 rounded-full px-3 py-1">
              +{profile.interests.length - 4} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => handleAction(onMessage || (() => {}))}
            variant="outline"
            size="lg"
            className="flex-1 rounded-2xl border-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Message
          </Button>
          <Button
            onClick={() => handleAction(onLike || (() => {}))}
            size="lg"
            className="flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
          >
            <Heart className="w-5 h-5 mr-2" />
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );
};