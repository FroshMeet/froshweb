import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Users, 
  Instagram, 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Grid3X3,
  Search,
  Filter,
  X,
  ThumbsDown,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolName } from "@/config/schoolNameMapping";
import { schools } from "@/data/schools";
import { getCorrectSchoolSlug, getApprovedSchoolData } from "@/utils/schoolNavigation";
import { getInstagramUsername } from "@/config/schoolInstagramMapping";
import { getSchoolDisplayName } from "@/config/schoolDisplayMapping";
import { isApprovedSchool, getApprovedSchool } from "@/config/approvedSchools";
import GuestMessageDialog from "@/components/GuestMessageDialog";
import PublicProfileBrowser from "@/components/PublicProfileBrowser";
import { GetFeaturedFlow } from "@/components/GetFeaturedFlow";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import SchoolGroupChatCTA from "@/components/SchoolGroupChatCTA";
import { useAppState } from "@/hooks/useAppState";
import { useDevMode } from "@/components/dev-mode/DevModeProvider";
import { mockProfiles } from "@/data/mockData";
import MeetTabContent from "@/components/tabs/MeetTabContent";
import ChatsTabContent from "@/components/tabs/ChatsTabContent";
import DiscoverTabContent from "@/components/tabs/DiscoverTabContent";

interface Profile {
  id: string;
  name: string;
  bio: string;
  class_year: string;
  photos: string[];
  social_links: any;
  school: string;
  created_at: string;
  major?: string;
  lookingFor?: string[];
}

export default function SchoolDashboard() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meetProfiles, setMeetProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [currentSwipeProfile, setCurrentSwipeProfile] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [meetScope, setMeetScope] = useState("school"); // "school" or "worldwide"
  const isMobile = useIsMobile();
  
  // Dev mode integration  
  const { devMode: isDevMode, toggleDevMode } = useDevMode();
  const { currentUser: appCurrentUser, isGuest, handleGuestAction: appStateGuestAction } = useAppState();
  
  // In dev mode, use DEV_USER, otherwise use real auth
  const DEV_USER = {
    id: "dev-user-123",
    name: "Dev Student",
    age: 18,
    college: "Test University",
    classOf: "2029",
    major: "Computer Science",
    bio: "Testing the FroshMeet interface!",
    interests: ["Testing", "UI/UX", "Development"],
    photos: ["photo-1649972904349-6e44c42644a7"],
    lookingFor: ["Friends", "Roommate"],
    location: "Test University",
    profilePic: "photo-1649972904349-6e44c42644a7",
    lookingForRoommate: true
  };
  
  const currentUser = isDevMode ? DEV_USER : appCurrentUser;
  
  // Validate school slug against approved schools
  const approvedSchool = school ? getApprovedSchool(school) : null;
  
  // If school is not approved, show 404-style page
  if (school && !approvedSchool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-black text-muted-foreground mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">School Not Found</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-md mx-auto">
              Sorry, "{school}" is not a supported school on FroshMeet yet.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')} 
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl font-bold"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
            <p className="text-sm text-muted-foreground">
              Want to add your school? Contact us to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get school data using navigation utility for proper mapping
  const schoolData = schools.find(s => s.id === school);
  const correctSlug = schoolData ? getCorrectSchoolSlug(schoolData) : school as string;
  const approvedSchoolData = schoolData ? getApprovedSchoolData(schoolData) : null;
  const schoolName = approvedSchoolData?.displayName || 
                    (schoolData ? (schoolData.shortName || schoolData.name) : '') ||
                    school || '';
  const schoolDisplayName = schoolName;
  const instagramUsername = approvedSchool?.instagramUsername || null;

  useEffect(() => {
    // In dev mode, we don't need to check auth since currentUser is auto-set
    if (!isDevMode) {
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // Handle real auth when not in dev mode
      };
      checkAuth();
    }

    const fetchProfiles = async () => {
      if (!school) return;
      
      try {
        // Fetch Instagram profiles for Discover tab
        const { data: instagramData, error: instagramError } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', school)
          .order('created_at', { ascending: false });

        if (instagramError) throw instagramError;
        setProfiles(instagramData || []);

        // Fetch user profiles for Meet tab (only in normal mode)
        if (!isDevMode) {
          const { data: userProfilesData, error: userProfilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('verified', true)
            .order('created_at', { ascending: false });

          if (userProfilesError) throw userProfilesError;
          
          // Transform to match expected format
          const transformedProfiles = (userProfilesData || []).map(profile => ({
            id: profile.user_id,
            name: profile.name,
            age: 18, // Default age
            college: profile.school,
            school: profile.school,
            classOf: profile.class_year,
            major: profile.major,
            bio: profile.bio,
            interests: profile.interests || [],
            photos: profile.avatar_url ? [profile.avatar_url] : ["photo-1649972904349-6e44c42644a7"],
            lookingFor: profile.looking_for_roommate ? ["Friends", "Roommate"] : ["Friends"],
            location: profile.school,
            profilePic: profile.avatar_url || "photo-1649972904349-6e44c42644a7",
            lookingForRoommate: profile.looking_for_roommate
          }));
          
          setMeetProfiles(transformedProfiles);
        } else {
          // In dev mode, use mock profiles
          setMeetProfiles(mockProfiles);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [school, isDevMode]);

  const handleGuestAction = (feature: string) => {
    if (!currentUser) {
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

  const [showGetFeaturedFlow, setShowGetFeaturedFlow] = useState(false);

  const handleGuestInstagramPost = () => {
    setShowGetFeaturedFlow(true);
  };

  // Mock sample profiles for grid view
  const sampleProfiles = [
    { id: 1, name: "Emma S.", year: "2029", major: "Computer Science", photo: null },
    { id: 2, name: "Alex M.", year: "2028", major: "Business", photo: null },
    { id: 3, name: "Sarah L.", year: "2029", major: "Psychology", photo: null },
    { id: 4, name: "Marcus T.", year: "2028", major: "Engineering", photo: null },
    { id: 5, name: "Jessica R.", year: "2029", major: "Biology", photo: null },
    { id: 6, name: "David K.", year: "2028", major: "Economics", photo: null }
  ];

  // Filter profiles based on search only (show everyone by default)
  const filteredProfiles = sampleProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.major.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSwipeAction = (action: "like" | "pass" | "message") => {
    if (!currentUser && !isDevMode) {
      handleGuestAction(action === "like" ? "liking profiles" : action === "message" ? "messaging" : "swiping");
      return;
    }
    
    // Move to next profile
    setCurrentSwipeProfile(prev => (prev + 1) % sampleProfiles.length);
    
    if (action === "like") {
      toast({ title: "Profile liked! ❤️", description: "We'll let you know if it's a match!" });
    } else if (action === "message") {
      toast({ title: "Message sent! 💬", description: "Your icebreaker has been delivered." });
    }
  };

  // Tab context mapping
  const getTabContextText = (tab: string) => {
    switch (tab) {
      case "discover": return `Browse profiles from ${schoolDisplayName} and beyond.`;
      case "meet": return "Find classmates and roommates.";
      case "chat": return `Join the ${schoolDisplayName} 2030 group chat.`;
      case "instagram": return "See what your class is posting.";
      default: return `Connect with ${schoolDisplayName} students.`;
    }
  };

  // School accent colors (subtle school-specific theming)
  const getSchoolAccentColor = (school: string) => {
    const schoolColors: Record<string, string> = {
      "upenn": "hsl(200, 100%, 50%)", // Penn Blue
      "harvard": "hsl(0, 75%, 45%)", // Harvard Crimson
      "stanford": "hsl(0, 75%, 45%)", // Stanford Cardinal
      "mit": "hsl(0, 0%, 45%)", // MIT Gray
      "ucla": "hsl(220, 100%, 50%)", // UCLA Blue
      "berkeley": "hsl(220, 90%, 40%)", // Cal Blue
      // Add more as needed, fallback to primary
    };
    return schoolColors[school?.toLowerCase()] || "hsl(var(--primary))";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Refined Header - Reduced Height */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-8 right-16 w-1 h-1 bg-neon-cyan rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-50"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Top Row - Back to Home + Dev Toggle */}
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground text-sm"
              size="sm"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to Home
            </Button>
            
            <Button 
              variant={isDevMode ? "default" : "outline"}
              onClick={toggleDevMode}
              className={`${isDevMode ? "bg-primary text-primary-foreground" : "border-primary/50 text-primary hover:bg-primary/10"} rounded-xl font-medium text-xs px-3 py-1`}
              size="sm"
            >
              {isDevMode ? "DEV ON" : "DEV OFF"}
            </Button>
          </div>
          
          <div className="text-center">
            {/* School name - FroshMeet Blue, Bold, Centered */}
            <h1 className="text-3xl md:text-4xl font-black text-primary mb-2 animate-fade-in-up tracking-tight">
              {schoolDisplayName}
            </h1>
            
            {/* Dynamic Status Line */}
            <p className="text-lg text-primary mb-4 font-medium">
              {profiles.length >= 15 
                ? `${profiles.length} students connected` 
                : `${schoolDisplayName} 2030 class is live 🎉 · ${profiles.length} students connected`
              }
            </p>

            {/* CTA Row - Horizontal Pills */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4 max-w-3xl mx-auto">
              <Button 
                onClick={handleCreateAccount}
                className="flex-1 min-w-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-full neon-glow transition-all duration-300 hover:scale-105"
              >
                <UserPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                Sign Up Free
              </Button>
              <Button 
                onClick={() => {
                  if (!currentUser && !isDevMode) {
                    navigate('/signup');
                  } else {
                    setActiveTab("chat");
                  }
                }}
                className="flex-1 min-w-0 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-bold px-6 py-3 rounded-full neon-glow transition-all duration-300 hover:scale-105"
              >
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                Join GC
              </Button>
              <Button 
                onClick={handleGuestInstagramPost}
                className="flex-1 min-w-0 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-0 hover:opacity-90 font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Instagram className="h-4 w-4 mr-2 flex-shrink-0" />
                Post on Insta
              </Button>
            </div>

            {/* School Accent Underline */}
            <div 
              className="h-0.5 w-16 mx-auto mb-3 rounded-full"
              style={{ backgroundColor: getSchoolAccentColor(school) }}
            ></div>

            {/* Tab Context Line */}
            <p className="text-sm text-muted-foreground font-medium">
              {getTabContextText(activeTab)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation - Enhanced Desktop vs Mobile Sizing */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <Button 
              variant={activeTab === "discover" ? "default" : "ghost"} 
              onClick={() => setActiveTab("discover")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-14 w-16 px-1" : "h-24 w-28 px-3"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "discover" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 neon-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Grid3X3 className={`${isMobile ? "h-5 w-5" : "h-9 w-9"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold leading-tight`}>Discover</span>
            </Button>
            
            <Button 
              variant={activeTab === "meet" ? "default" : "ghost"} 
              onClick={() => setActiveTab("meet")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-14 w-16 px-1" : "h-24 w-28 px-3"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "meet" 
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110 neon-glow-strong" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Heart className={`${isMobile ? "h-5 w-5" : "h-9 w-9"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold leading-tight`}>Meet</span>
            </Button>
            
            <Button 
              variant={activeTab === "chat" ? "default" : "ghost"} 
              onClick={() => setActiveTab("chat")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-14 w-16 px-1" : "h-24 w-28 px-3"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "chat" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 neon-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <MessageSquare className={`${isMobile ? "h-5 w-5" : "h-9 w-9"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold leading-tight`}>Chat</span>
            </Button>
            
            <Button 
              variant={activeTab === "instagram" ? "default" : "ghost"} 
              onClick={() => setActiveTab("instagram")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-14 w-16 px-1" : "h-24 w-28 px-3"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "instagram" 
                  ? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Instagram className={`${isMobile ? "h-5 w-5" : "h-9 w-9"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold leading-tight text-center`}>
                {isMobile ? schoolDisplayName : `${schoolDisplayName}'s Insta`}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        
        {/* Discover Tab */}
        {activeTab === "discover" && (
          <div className="h-[calc(100vh-200px)] animate-fade-in">
            <DiscoverTabContent 
              schoolName={schoolDisplayName}
              schoolSlug={school || ''}
            />
          </div>
        )}

        {/* Meet Tab - New FroshMeet Interface */}
        {activeTab === "meet" && (
          <div className="h-[calc(100vh-200px)] animate-fade-in">
            <MeetTabContent
              profiles={meetProfiles}
              isGuest={!currentUser && !isDevMode}
              onGuestAction={appStateGuestAction}
              schoolName={schoolDisplayName}
            />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="h-[calc(100vh-200px)] animate-fade-in">
            <ChatsTabContent 
              schoolName={schoolDisplayName}
              schoolSlug={school || ''}
            />
          </div>
        )}

        {/* Instagram Tab */}
        {activeTab === "instagram" && (
          <div className="space-y-8 animate-fade-in">
            {/* Instagram Account Header */}
            <div className="text-center bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 rounded-3xl p-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <Instagram className="h-20 w-20 text-[#E4405F]" />
                <div>
                  <h3 className="text-4xl font-black text-[#E4405F] mb-2">@{instagramUsername || `${school}2030class`}</h3>
                  <p className="text-muted-foreground text-lg">
                    Official Instagram account for {schoolDisplayName} Class of 2030
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open(`https://instagram.com/${instagramUsername || `${school}2030class`}`, '_blank')}
                  size="lg"
                  variant="outline"
                  className="border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F]/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                >
                  <Instagram className="h-6 w-6 mr-3" />
                  View on Instagram
                </Button>
                
                 <Button 
                   onClick={handleGuestInstagramPost}
                   size="lg"
                   className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                 >
                   <Instagram className="h-6 w-6 mr-2" />
                   📸 Post on {schoolDisplayName}'s Insta
                 </Button>
              </div>
            </div>

            {/* Instagram Posts Grid */}
            <div>
              <h4 className="text-2xl font-bold mb-6 text-foreground">Recent Posts</h4>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center hover:bg-muted/80 transition-all duration-300 cursor-pointer hover:scale-105 card-shadow">
                    <Instagram className="h-12 w-12 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-6 text-center">
                Follow @{instagramUsername || `${school}2030class`} on Instagram to see student features and campus highlights
              </p>
            </div>
          </div>
        )}

      </div>

      <GuestMessageDialog 
        isOpen={showGuestDialog}
        onClose={() => setShowGuestDialog(false)}
        onCreateAccount={handleCreateAccount}
      />
      
      <GetFeaturedFlow 
        open={showGetFeaturedFlow}
        onOpenChange={setShowGetFeaturedFlow}
        preSelectedSchool={school}
      />
    </div>
  );
}
