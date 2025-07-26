import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  X, 
  MapPin, 
  GraduationCap, 
  Home,
  Sparkles,
  MessageCircle,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import GuestMessageDialog from "./GuestMessageDialog";

interface Profile {
  user_id: string;
  name: string;
  avatar_url?: string;
  school: string;
  major: string;
  bio?: string;
  class_year: string;
  interests: string[];
  looking_for_roommate: boolean;
}

interface MatchCelebrationProps {
  matchedUser: Profile;
  onClose: () => void;
  onSendMessage: () => void;
}

const MatchCelebration = ({ matchedUser, onClose, onSendMessage }: MatchCelebrationProps) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-pink-500/30 animate-scale-in">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="h-12 w-12 text-pink-500 animate-pulse mx-1"
                style={{ animationDelay: `${i * 0.2}s` }}
                fill="currentColor"
              />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">It's a Match!</h2>
          <p className="text-muted-foreground">
            You and {matchedUser.name} liked each other
          </p>
        </div>

        <div className="bg-background/50 rounded-lg p-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {matchedUser.name[0]}
            </span>
          </div>
          <h3 className="font-semibold">{matchedUser.name}</h3>
          <p className="text-sm text-muted-foreground">
            {matchedUser.major} • {matchedUser.school}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onSendMessage}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 neon-glow"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-pink-500/30 text-foreground hover:bg-pink-500/10"
          >
            Keep Swiping
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const TinderSwipeInterface = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [isSwipeDisabled, setIsSwipeDisabled] = useState(false);

  const isGuest = !user;
  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    if (user) {
      loadPotentialMatches();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadPotentialMatches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_potential_matches', { 
          user_id_param: user.id,
          limit_count: 20 
        });

      if (error) throw error;

      setProfiles(data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading potential matches:', error);
      toast({
        title: "Error",
        description: "Failed to load potential matches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isGuest) {
      setShowGuestDialog(true);
      return;
    }

    if (!user || !currentProfile || isSwipeDisabled) return;

    setIsSwipeDisabled(true);

    try {
      const { data, error } = await supabase
        .rpc('handle_swipe', {
          swiper_id: user.id,
          target_id: currentProfile.user_id,
          swipe_direction: direction
        });

      if (error) throw error;

      const result = data as { success: boolean; match: boolean; message: string };

      if (result.match) {
        setMatchedUser(currentProfile);
        setShowMatchCelebration(true);
        
        toast({
          title: "🎉 It's a Match!",
          description: `You and ${currentProfile.name} liked each other!`,
        });
      }

      // Move to next profile
      setCurrentIndex(prev => prev + 1);
      
    } catch (error) {
      console.error('Error handling swipe:', error);
      toast({
        title: "Error",
        description: "Failed to process swipe",
        variant: "destructive"
      });
    } finally {
      setIsSwipeDisabled(false);
    }
  };

  const handleSendMessage = () => {
    setShowMatchCelebration(false);
    // Navigate to chat would happen here - for now just close
    toast({
      title: "Chat Started",
      description: `You can now message ${matchedUser?.name} in your chats!`,
    });
  };

  const getUnsplashUrl = (photoId: string, width: number = 400, height: number = 600) => {
    return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&crop=face`;
  };

  if (isGuest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/40">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Start Swiping</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to start swiping and matching with classmates
            </p>
            <Button 
              onClick={() => setShowGuestDialog(true)}
              className="w-full neon-glow"
            >
              Sign Up to Swipe
            </Button>
          </CardContent>
        </Card>
        
        <GuestMessageDialog
          isOpen={showGuestDialog}
          onClose={() => setShowGuestDialog(false)}
          onCreateAccount={() => setShowGuestDialog(false)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading potential matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/40">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
            <p className="text-muted-foreground mb-6">
              You've seen all available profiles! Check back later for new classmates.
            </p>
            <Button 
              onClick={loadPotentialMatches}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 max-w-4xl mx-auto">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-primary">Discover</h1>
          <p className="text-sm text-muted-foreground">
            {profiles.length - currentIndex} profiles remaining
          </p>
        </div>
      </div>

      {/* Main Swipe Area */}
      <div className="relative z-10 flex justify-center px-4 pb-32">
        <div className="w-full max-w-sm relative">
          {/* Profile Card */}
          <Card className="w-full bg-card/90 backdrop-blur-xl border-border/40 shadow-2xl overflow-hidden">
            {/* Profile Image */}
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {currentProfile.name[0]}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentProfile.name}
                  </h2>
                </div>
              </div>
              
              {/* Looking for Roommate Badge */}
              {currentProfile.looking_for_roommate && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Home className="h-3 w-3 mr-1" />
                    Roommate
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              {/* Basic Info */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentProfile.school}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {currentProfile.major} • Class of {currentProfile.class_year}
                </div>
              </div>

              {/* Bio */}
              {currentProfile.bio && (
                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {currentProfile.bio}
                  </p>
                </div>
              )}

              {/* Interests */}
              {currentProfile.interests && currentProfile.interests.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.slice(0, 6).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mt-8">
            <Button
              onClick={() => handleSwipe('left')}
              disabled={isSwipeDisabled}
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50"
            >
              <X className="h-8 w-8 text-red-500" />
            </Button>
            
            <Button
              onClick={() => handleSwipe('right')}
              disabled={isSwipeDisabled}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all duration-300 neon-glow disabled:opacity-50"
            >
              <Heart className="h-8 w-8" fill="currentColor" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Tap ❌ to pass • Tap ❤️ to like
            </p>
          </div>
        </div>
      </div>

      {/* Match Celebration */}
      {showMatchCelebration && matchedUser && (
        <MatchCelebration
          matchedUser={matchedUser}
          onClose={() => setShowMatchCelebration(false)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default TinderSwipeInterface;