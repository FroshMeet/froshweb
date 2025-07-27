import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MapPin, GraduationCap, Home, Sparkles, MessageCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/useAppState";
import GuestMessageDialog from "./GuestMessageDialog";
import { mockProfiles } from "@/data/mockData";
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
const MatchCelebration = ({
  matchedUser,
  onClose,
  onSendMessage
}: MatchCelebrationProps) => <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
    <Card className="mobile-card max-w-sm bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 animate-bounce-in neon-glow-strong">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            {[...Array(3)].map((_, i) => <Heart key={i} className="h-12 w-12 text-pink-500 animate-pulse mx-1" style={{
            animationDelay: `${i * 0.2}s`
          }} fill="currentColor" />)}
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

        <div className="space-y-4">
          <Button onClick={onSendMessage} className="touch-target w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white font-semibold py-4 rounded-2xl neon-glow btn-pulse">
            <MessageCircle className="h-5 w-5 mr-3" />
            Send Message
          </Button>
          <Button variant="outline" onClick={onClose} className="touch-target w-full border-primary/30 text-foreground hover:bg-primary/10 py-4 rounded-2xl">
            Keep Swiping
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>;
const TinderSwipeInterface = () => {
  const {
    user,
    userProfile
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    isGuest,
    isAuthenticated,
    handleGuestAction,
    showGuestDialog,
    setShowGuestDialog,
    isDevMode
  } = useAppState();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null);
  const [isSwipeDisabled, setIsSwipeDisabled] = useState(false);
  const currentProfile = profiles[currentIndex];
  useEffect(() => {
    if (isAuthenticated || isDevMode) {
      if (isDevMode) {
        // Use mock data in dev mode
        const mockProfilesFormatted = mockProfiles.map(p => ({
          user_id: p.id.toString(),
          name: p.name,
          avatar_url: undefined,
          school: p.college,
          major: p.major,
          bio: p.bio,
          class_year: p.classOf,
          interests: p.interests,
          looking_for_roommate: p.lookingFor.includes("Roommate")
        }));
        setProfiles(mockProfilesFormatted);
        setCurrentIndex(0);
        setIsLoading(false);
      } else {
        loadPotentialMatches();
      }
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDevMode]);
  const loadPotentialMatches = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.rpc('get_potential_matches', {
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
      handleGuestAction();
      return;
    }
    if (!user || !currentProfile || isSwipeDisabled) return;
    setIsSwipeDisabled(true);
    try {
      const {
        data,
        error
      } = await supabase.rpc('handle_swipe', {
        swiper_id: user.id,
        target_id: currentProfile.user_id,
        swipe_direction: direction
      });
      if (error) throw error;
      const result = data as {
        success: boolean;
        match: boolean;
        message: string;
      };
      if (result.match) {
        setMatchedUser(currentProfile);
        setShowMatchCelebration(true);
        toast({
          title: "🎉 It's a Match!",
          description: `You and ${currentProfile.name} liked each other!`
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
      description: `You can now message ${matchedUser?.name} in your chats!`
    });
  };
  const getUnsplashUrl = (photoId: string, width: number = 400, height: number = 600) => {
    return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&crop=face`;
  };
  if (isGuest) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/40">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Start Swiping</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to start swiping and matching with classmates
            </p>
            <Button onClick={() => setShowGuestDialog(true)} className="w-full neon-glow">
              Sign Up to Swipe
            </Button>
          </CardContent>
        </Card>
        
        <GuestMessageDialog isOpen={showGuestDialog} onClose={() => setShowGuestDialog(false)} onCreateAccount={() => setShowGuestDialog(false)} />
      </div>;
  }
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading potential matches...</p>
        </div>
      </div>;
  }
  if (!currentProfile) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/40">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
            <p className="text-muted-foreground mb-6">
              You've seen all available profiles! Check back later for new classmates.
            </p>
            <Button onClick={loadPotentialMatches} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border/20">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Meet the Class of 2030
          </h1>
          <p className="text-sm text-muted-foreground">
            {profiles.length - currentIndex} profiles remaining
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Profile Card */}
          <Card className="w-full bg-card/90 backdrop-blur-sm border border-border/50 overflow-hidden shadow-2xl">
            {/* Profile Image Area */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/30 mx-auto mb-4 flex items-center justify-center border-2 border-primary/50">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {currentProfile.name[0]}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {currentProfile.name}
                  </h2>
                  <p className="text-sm text-white/70">
                    {currentProfile.major}
                  </p>
                </div>
              </div>
              
              {/* Roommate Badge */}
              {currentProfile.looking_for_roommate && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Home className="h-3 w-3 mr-1" />
                    Roommate
                  </Badge>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <CardContent className="p-4 md:p-6">
              {/* School Info */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {currentProfile.school}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Class of {currentProfile.class_year}
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
                <div>
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
          <div className="flex justify-center items-center gap-8 mt-8">
            <Button 
              onClick={() => handleSwipe('left')} 
              disabled={isSwipeDisabled} 
              size="lg" 
              variant="outline" 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
            >
              <X className="h-8 w-8 md:h-10 md:w-10 text-destructive" />
            </Button>
            
            <Button 
              onClick={() => handleSwipe('right')} 
              disabled={isSwipeDisabled} 
              size="lg" 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-white shadow-lg transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
            >
              <Heart className="h-8 w-8 md:h-10 md:w-10" fill="currentColor" />
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