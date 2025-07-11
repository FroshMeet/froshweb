
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Instagram, ExternalLink, ArrowLeft, Heart, MessageSquare, UserPlus, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolName } from "@/config/schoolNameMapping";
import GuestProfile from "@/components/GuestProfile";
import GuestMessageDialog from "@/components/GuestMessageDialog";
import SwipeInterface from "@/components/SwipeInterface";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  name: string;
  bio: string;
  class_year: string;
  photos: string[];
  social_links: any;
  school: string;
  created_at: string;
}

export default function SchoolDashboard() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("meet");
  const [showSwipeInterface, setShowSwipeInterface] = useState(false);
  
  const schoolName = school ? getSchoolName(school) : school?.toUpperCase();
  const schoolDisplayName = schoolName || school?.toUpperCase() || '';
  const schoolAcronym = school?.toUpperCase() || '';

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    const fetchProfiles = async () => {
      if (!school) return;
      
      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', school.toUpperCase())
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [school]);

  const handleSocialClick = (platform: string, handle: string) => {
    let url = '';
    switch (platform) {
      case 'instagram':
        url = `https://instagram.com/${handle.replace('@', '')}`;
        break;
      case 'tiktok':
        url = `https://tiktok.com/@${handle.replace('@', '')}`;
        break;
      case 'twitter':
        url = `https://twitter.com/${handle.replace('@', '')}`;
        break;
      case 'linkedin':
        url = handle.includes('linkedin.com') ? handle : `https://linkedin.com/in/${handle}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  const handleGuestAction = (feature: string) => {
    if (!user) {
      toast({
        title: `Join FroshMeet for ${feature}`,
        description: "Create a free account to access all features",
      });
      setShowGuestDialog(true);
    }
  };

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  const handleGuestInstagramPost = () => {
    navigate(`/${school}/guest-post-to-insta`);
  };

  const handleMeetClick = () => {
    setShowSwipeInterface(true);
  };

  if (showSwipeInterface) {
    return (
      <SwipeInterface
        schoolName={schoolDisplayName}
        profiles={profiles}
        isGuest={!user}
        onGuestAction={() => handleGuestAction('meet feature')}
        onClose={() => setShowSwipeInterface(false)}
        mode="meet"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">
                {schoolDisplayName.charAt(0)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in">
              {schoolDisplayName}
            </h1>
            <p className="text-muted-foreground mb-2">
              Connect with fellow students and build lasting friendships
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4" />
              <span>{profiles.length} students connected</span>
            </div>

            {!user && (
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  ✨ Create a free profile for the full FroshMeet experience!
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleCreateAccount}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sign Up Free
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleGuestInstagramPost}
                    size="sm"
                    className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Post on {schoolAcronym}'s Insta
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-8 h-12">
            <TabsTrigger value="meet" className="text-sm font-medium hover:bg-primary/10 transition-all duration-200">
              <Heart className="h-4 w-4 mr-2" />
              Meet
            </TabsTrigger>
            <TabsTrigger value="roommates" className="text-sm font-medium hover:bg-primary/10 transition-all duration-200">
              <Home className="h-4 w-4 mr-2" />
              Roommates
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-sm font-medium hover:bg-primary/10 transition-all duration-200">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="instagram-feed" className="text-sm font-medium hover:bg-primary/10 transition-all duration-200">
              <Instagram className="h-4 w-4 mr-2" />
              {schoolAcronym}'s Instagram
            </TabsTrigger>
          </TabsList>

          {/* Instagram Feed Tab */}
          <TabsContent value="instagram-feed" className="mt-0">
            <div className="space-y-8">
              {/* Instagram Account Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Instagram className="h-8 w-8 text-[#E4405F]" />
                  <div>
                    <h3 className="text-2xl font-bold">@{school}2030class</h3>
                    <p className="text-lg font-bold text-muted-foreground">@{school}2030class</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Official Instagram account for {schoolDisplayName} Class of 2030
                </p>
                
                <Button 
                  onClick={user ? () => navigate(`/${school}/post-to-insta`) : handleGuestInstagramPost}
                  className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Submit Profile to Instagram ($5)
                </Button>
              </div>

              {/* Mock Instagram Posts Grid */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Recent Posts</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                      <Instagram className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Follow @{school}2030class on Instagram to see student features
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Meet Tab */}
          <TabsContent value="meet" className="mt-0">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Meet Fellow Students</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse and connect with students who share your interests
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleMeetClick}
              >
                <Heart className="h-4 w-4 mr-2" />
                Browse Students
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  Sign up to match and message students
                </p>
              )}
            </div>
          </TabsContent>

          {/* Roommates Tab */}
          <TabsContent value="roommates" className="mt-0">
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Roommates</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse roommate profiles and find your perfect housing match
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowSwipeInterface(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Browse Roommates
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground mt-4">
                  Sign up to connect with potential roommates
                </p>
              )}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">School Chat Rooms</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {user ? 'Join conversations with your classmates in dedicated chat rooms' : 'Create an account to join school-specific chat rooms and start conversations'}
              </p>
              {user ? (
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Chat Rooms
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateAccount}
                  className="bg-primary hover:bg-primary/90"
                >
                  Create Account to Chat
                </Button>
              )}
            </div>
          </TabsContent>

        </Tabs>

        {/* Website Posts Section (unlabeled) */}
        <div className="mt-12 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Mock website profiles */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm">Sample Profile {i}</h4>
                  <p className="text-xs text-muted-foreground">Class of 2030</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={user ? () => navigate('/create-profile') : () => handleGuestAction('profile creation')}
              variant="outline"
              size="sm"
            >
              Sign up to be posted
            </Button>
          </div>
        </div>
      </div>

      <GuestMessageDialog 
        isOpen={showGuestDialog}
        onClose={() => setShowGuestDialog(false)}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}
