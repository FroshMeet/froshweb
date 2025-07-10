import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Instagram, ExternalLink, ArrowLeft, Heart, MessageSquare, UserPlus, Home, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolName } from "@/config/schoolNameMapping";
import GuestProfile from "@/components/GuestProfile";
import GuestMessageDialog from "@/components/GuestMessageDialog";
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
  const [activeTab, setActiveTab] = useState("posts");
  
  const schoolName = school ? getSchoolName(school) : school?.toUpperCase();
  const schoolDisplayName = schoolName || school?.toUpperCase() || '';

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
    navigate('/auth');
  };

  const handleGuestInstagramPost = () => {
    navigate(`/${school}/guest-post-to-insta`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-2xl">
                {schoolDisplayName.charAt(0)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {schoolDisplayName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Connect with fellow students and build lasting friendships
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Users className="h-4 w-4" />
              <span>{profiles.length} students connected</span>
            </div>

            {!user && (
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 mb-6 border border-primary/30">
                <p className="text-sm text-foreground mb-3">
                  ✨ <strong>Create a free profile for the full FroshMeet experience!</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    onClick={handleCreateAccount}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up Free
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleGuestInstagramPost}
                    size="sm"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Quick $5 Instagram Post
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
          <TabsList className="grid grid-cols-6 w-full mb-8">
            <TabsTrigger value="posts">Website Posts</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="meet">Meet</TabsTrigger>
            <TabsTrigger value="roommates">Roommates</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="insta-overview">Insta Feed</TabsTrigger>
          </TabsList>

          {/* Website Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Student Profiles</h2>
                <p className="text-muted-foreground">Free profiles from {schoolDisplayName} students</p>
              </div>
              <Button 
                onClick={user ? () => navigate('/create-profile') : () => handleGuestAction('profile creation')}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {user ? 'Create Profile' : 'Join to Create Profile'}
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profiles...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No profiles yet!</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Be the first student from {schoolDisplayName} to create a profile.
                </p>
                <Button 
                  onClick={user ? () => navigate('/create-profile') : () => handleGuestAction('profile creation')}
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {user ? 'Create First Profile' : 'Join to Create Profile'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <Card 
                    key={profile.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => navigate(`/${school}/post-to-insta?profileId=${profile.id}`)}
                  >
                    <div className="relative">
                      {profile.photos && profile.photos.length > 0 && (
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={profile.photos[0]}
                            alt={`${profile.name}'s photo`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {profile.photos.length > 1 && (
                            <Badge 
                              variant="secondary" 
                              className="absolute top-2 right-2 bg-black/50 text-white"
                            >
                              +{profile.photos.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {profile.name}
                          </CardTitle>
                          <CardDescription>Class of {profile.class_year}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {school?.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}
                      
                      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Object.entries(profile.social_links).map(([platform, handle]) => (
                            handle && (
                              <Button
                                key={platform}
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSocialClick(platform, handle as string);
                                }}
                              >
                                {platform === 'instagram' && <Instagram className="h-3 w-3 mr-1" />}
                                {platform}: {(handle as string).replace('@', '@')}
                                <ExternalLink className="h-2 w-2 ml-1" />
                              </Button>
                            )
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Want this on Instagram? Click to see options</span>
                        <Heart className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram" className="mt-0">
            <div className="text-center py-12">
              <Instagram className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get Featured on Instagram</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Pay $5 to get your profile posted on @{school}2030class Instagram account
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={user ? () => navigate(`/${school}/post-to-insta`) : handleGuestInstagramPost}
                  className="bg-primary hover:bg-primary/90"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {user ? 'Post to Instagram ($5)' : 'Quick Instagram Post ($5)'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/${school}/insta/posts`)}
                >
                  View Paid Features
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Meet Tab */}
          <TabsContent value="meet" className="mt-0">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Meet Fellow Students</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {user ? 'Connect with students who share your interests' : 'Sign up to discover and connect with like-minded classmates'}
              </p>
              {user ? (
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Meeting People
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Preview available - limited features for guests</p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => handleGuestAction('meet feature')}
                    >
                      Browse (Limited)
                    </Button>
                    <Button 
                      onClick={handleCreateAccount}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Join for Full Access
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Roommates Tab */}
          <TabsContent value="roommates" className="mt-0">
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Roommates</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {user ? 'Find the perfect roommate match for your dorm or apartment' : 'Create an account to access our roommate matching system'}
              </p>
              {user ? (
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Users className="h-4 w-4 mr-2" />
                  Find Roommates
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Preview available - limited features for guests</p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => handleGuestAction('roommate finder')}
                    >
                      Browse (Limited)
                    </Button>
                    <Button 
                      onClick={handleCreateAccount}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Join for Full Access
                    </Button>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Account required for chat access</p>
                  <Button 
                    onClick={handleCreateAccount}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create Account to Chat
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Instagram Feed Tab */}
          <TabsContent value="insta-overview" className="mt-0">
            <div className="text-center py-12">
              <Instagram className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">@{school}2030class</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Check out the official {schoolDisplayName} Instagram account featuring student profiles
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open(`https://instagram.com/${school}2030class`, '_blank')}
                size="lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Instagram
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GuestMessageDialog 
        isOpen={showGuestDialog}
        onClose={() => setShowGuestDialog(false)}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}