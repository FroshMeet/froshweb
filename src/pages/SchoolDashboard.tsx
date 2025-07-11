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
import PublicProfileBrowser from "@/components/PublicProfileBrowser";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [activeTab, setActiveTab] = useState("");
  const isMobile = useIsMobile();
  
  const schoolName = school ? getSchoolName(school) : school?.toUpperCase();
  const schoolDisplayName = schoolName || school?.toUpperCase() || '';
  const schoolAcronym = schoolDisplayName.split(' ')[0] || school?.toUpperCase() || '';

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

  // Mock sample profiles for default view
  const sampleProfiles = [
    { id: 1, name: "Emma S.", year: "2029", major: "Computer Science" },
    { id: 2, name: "Alex M.", year: "2028", major: "Business" },
    { id: 3, name: "Sarah L.", year: "2029", major: "Psychology" },
    { id: 4, name: "Marcus T.", year: "2028", major: "Engineering" }
  ];

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
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">
                {schoolAcronym.charAt(0)}
              </span>
            </div>
            
            {/* School name with animation */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 animate-fade-in">
              {schoolDisplayName}
            </h1>
            
            {/* Subheader */}
            <p className="text-lg text-muted-foreground mb-4">
              Connect with fellow students and build lasting friendships
            </p>
            
            {/* Student count */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Users className="h-4 w-4" />
              <span>{profiles.length} students connected</span>
            </div>

            {/* Two side-by-side CTAs */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleCreateAccount}
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up Free
              </Button>
              <Button 
                onClick={handleGuestInstagramPost}
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-0 hover:opacity-90"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Post on {schoolAcronym}'s Insta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs Navigation */}
          <TabsList className="grid grid-cols-4 w-full mb-8 h-14 bg-card border border-border">
            <TabsTrigger value="meet" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Meet
            </TabsTrigger>
            <TabsTrigger value="roommates" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Roommates
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Chat
            </TabsTrigger>
            <TabsTrigger value="instagram" className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
              <Instagram className="h-4 w-4 text-[#E4405F]" />
              {schoolAcronym}'s Instagram
            </TabsTrigger>
          </TabsList>

          {/* Default View - Grid of Sample Profiles (when no tab is selected) */}
          {!activeTab && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sampleProfiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm">{profile.name}</h4>
                      <p className="text-xs text-muted-foreground">Class of {profile.year}</p>
                      <p className="text-xs text-muted-foreground mt-1">{profile.major}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Sign up to create your profile and get featured!
                </p>
                <Button 
                  onClick={handleCreateAccount}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  Create Your Profile
                </Button>
              </div>
            </div>
          )}

          {/* Meet Tab */}
          <TabsContent value="meet" className="mt-0">
            <PublicProfileBrowser 
              onGuestAction={() => handleGuestAction('meet feature')}
              isMobile={isMobile}
              viewMode="swipe"
            />
          </TabsContent>

          {/* Roommates Tab */}
          <TabsContent value="roommates" className="mt-0">
            <PublicProfileBrowser 
              onGuestAction={() => handleGuestAction('roommate finder')}
              isMobile={isMobile}
              viewMode="swipe"
            />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="text-center py-16">
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

          {/* Instagram Tab */}
          <TabsContent value="instagram" className="mt-0">
            <div className="space-y-8">
              {/* Instagram Account Header */}
              <div className="text-center">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Instagram className="h-16 w-16 text-[#E4405F]" />
                  <h3 className="text-3xl font-bold text-[#E4405F]">@{school}2030class</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Official Instagram account for {schoolDisplayName} Class of 2030
                </p>
                
                <Button 
                  onClick={handleGuestInstagramPost}
                  size="lg"
                  className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Post on {schoolAcronym}'s Insta ($5)
                </Button>
              </div>

              {/* Instagram Posts Grid */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Recent Posts</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
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

        </Tabs>
      </div>

      {/* Footer / Sign Up Prompt */}
      <div className="border-t bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Ready to connect with your classmates?
          </p>
          <Button 
            onClick={handleCreateAccount}
            className="bg-primary hover:bg-primary/90"
          >
            Join FroshMeet Today
          </Button>
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