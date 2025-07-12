import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  major?: string;
  lookingFor?: string[];
}

export default function SchoolDashboard() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [currentSwipeProfile, setCurrentSwipeProfile] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [meetScope, setMeetScope] = useState("school"); // "school" or "worldwide"
  const isMobile = useIsMobile();
  
  const schoolName = school ? getSchoolName(school) : school?.toUpperCase();
  const schoolDisplayName = schoolName || school?.toUpperCase() || '';
  const schoolAcronym = schoolDisplayName.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || school?.toUpperCase() || '';

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
    if (!user) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Bold Animation */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-20 right-16 w-1 h-1 bg-neon-cyan rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-16 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-50"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            {/* School acronym badge with glow */}
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 neon-glow">
              <span className="text-primary-foreground font-bold text-2xl">
                {schoolAcronym.charAt(0)}
              </span>
            </div>
            
            {/* School name with enhanced animation and FroshMeet blue */}
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 animate-fade-in-up tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {schoolDisplayName}
              </span>
            </h1>
            
            {/* Animated subheader */}
            <p className="text-xl md:text-2xl text-primary mb-6 animate-fade-in font-medium">
              Connect with fellow students and build lasting friendships
            </p>
            
            {/* Student count with enhanced styling */}
            <div className="flex items-center justify-center gap-3 text-lg text-muted-foreground mb-8">
              <Users className="h-6 w-6 text-primary" />
              <span className="font-semibold">{profiles.length} students connected</span>
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                onClick={handleCreateAccount}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-2xl neon-glow transition-all duration-300 hover:scale-105"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up Free
              </Button>
              <Button 
                onClick={handleGuestInstagramPost}
                size="lg"
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-0 hover:opacity-90 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Post on {schoolAcronym}'s Insta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation - Desktop vs Mobile Sizing */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t border-border/50 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <Button 
              variant={activeTab === "discover" ? "default" : "ghost"} 
              onClick={() => setActiveTab("discover")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-16 w-20" : "h-20 w-24"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "discover" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 neon-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Grid3X3 className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold`}>Discover</span>
            </Button>
            
            <Button 
              variant={activeTab === "meet" ? "default" : "ghost"} 
              onClick={() => setActiveTab("meet")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-16 w-20" : "h-20 w-24"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "meet" 
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110 neon-glow-strong" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Heart className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold`}>Meet</span>
            </Button>
            
            <Button 
              variant={activeTab === "chat" ? "default" : "ghost"} 
              onClick={() => setActiveTab("chat")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-16 w-20" : "h-20 w-24"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "chat" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 neon-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <MessageSquare className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} mb-1 ${activeTab === "chat" ? "" : "bg-transparent"}`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold`}>Chat</span>
            </Button>
            
            <Button 
              variant={activeTab === "instagram" ? "default" : "ghost"} 
              onClick={() => setActiveTab("instagram")} 
              className={`flex flex-col items-center justify-center ${
                isMobile ? "h-16 w-20" : "h-20 w-24"
              } rounded-2xl transition-all duration-300 ${
                activeTab === "instagram" 
                  ? "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Instagram className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} mb-1`} />
              <span className={`${isMobile ? "text-xs" : "text-sm"} font-bold`}>{schoolAcronym}'s Insta</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        
        {/* Discover Tab */}
        {activeTab === "discover" && (
          <div className="space-y-6 animate-fade-in">
            {/* Sticky Search Bar Only - Removed Toggle */}
            <div className="sticky top-4 z-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 card-shadow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, major, class year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/40 rounded-xl"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredProfiles.length} students found
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="group overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer hover:scale-105 bg-card/50 backdrop-blur-sm border-border/40">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                    <Users className="h-16 w-16 text-primary/60" />
                    {Math.random() > 0.5 && (
                      <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs">
                        Roommate
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-foreground text-sm">{profile.name}</h4>
                    <p className="text-xs text-muted-foreground">Class of {profile.year}</p>
                    <p className="text-xs text-primary font-medium mt-1">{profile.major}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-3 border-primary/50 text-primary hover:bg-primary/10 rounded-xl"
                      onClick={() => handleGuestAction("viewing profiles")}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProfiles.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Meet Tab - Enhanced for Desktop/Mobile */}
        {activeTab === "meet" && (
          <div className="space-y-6 animate-fade-in">
            {/* Enhanced Filters */}
            <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 card-shadow">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground">{schoolDisplayName} Students</h3>
                  <ToggleGroup type="single" value={filterMode} onValueChange={setFilterMode}>
                    <ToggleGroupItem value="all" className="px-6 rounded-xl">Everyone</ToggleGroupItem>
                    <ToggleGroupItem value="roommates" className="px-6 rounded-xl">Roommates Only</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                {filterMode === "all" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant={meetScope === "school" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetScope("school")}
                      className="rounded-xl"
                    >
                      Your School
                    </Button>
                    <Button
                      variant={meetScope === "worldwide" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMeetScope("worldwide")}
                      className="rounded-xl"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Worldwide
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Swipe Card - Desktop Horizontal vs Mobile Vertical */}
            {isMobile ? (
              /* Mobile: Vertical Card Layout with Swipe Gestures */
              <div 
                className="relative h-[600px] flex items-center justify-center touch-pan-x"
                onTouchStart={(e) => {
                  // Store touch start position for swipe detection
                  const touch = e.touches[0];
                  e.currentTarget.dataset.startX = touch.clientX.toString();
                  e.currentTarget.dataset.startY = touch.clientY.toString();
                }}
                onTouchEnd={(e) => {
                  const startX = parseFloat(e.currentTarget.dataset.startX || "0");
                  const startY = parseFloat(e.currentTarget.dataset.startY || "0");
                  const endX = e.changedTouches[0].clientX;
                  const endY = e.changedTouches[0].clientY;
                  const deltaX = endX - startX;
                  const deltaY = endY - startY;
                  const threshold = 100;

                  if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > threshold) {
                      handleSwipeAction("like"); // Swipe right = like
                    } else if (deltaX < -threshold) {
                      handleSwipeAction("pass"); // Swipe left = pass
                    }
                  } else if (Math.abs(deltaY) > threshold && deltaY < 0) {
                    handleSwipeAction("message"); // Swipe up = message
                  }
                }}
              >
                <Card className="w-full max-w-md h-full bg-card/80 backdrop-blur-xl border-border/40 overflow-hidden card-shadow-lg">
                  <div 
                    className="relative h-3/5 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const width = rect.width;
                      
                      if (clickX > width / 2) {
                        setCurrentPhotoIndex(prev => (prev + 1) % 5); // Mock 5 photos
                      } else {
                        setCurrentPhotoIndex(prev => prev === 0 ? 4 : prev - 1);
                      }
                    }}
                  >
                    <Users className="h-24 w-24 text-primary/60" />
                    {filterMode === "roommates" && (
                      <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                        Looking for Roommate
                      </Badge>
                    )}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {sampleProfiles[currentSwipeProfile]?.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Class of {sampleProfiles[currentSwipeProfile]?.year} • {sampleProfiles[currentSwipeProfile]?.major}
                      </p>
                      <p className="text-sm text-foreground mt-2">
                        {meetScope === "school" ? schoolDisplayName : "Worldwide 🌐"}
                      </p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      "Hey! I'm looking forward to meeting new people and exploring campus together! 🎓"
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Desktop: Horizontal Split Layout */
              <div className="relative h-[600px] flex items-center justify-center">
                <Card className="w-full max-w-4xl h-full bg-card/80 backdrop-blur-xl border-border/40 overflow-hidden card-shadow-lg">
                  <div className="flex h-full">
                    {/* Left: Large Photo with Navigation */}
                    <div className="relative w-1/2 h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <Users className="h-32 w-32 text-primary/60" />
                      
                      {/* Photo Navigation Arrows */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-10 h-10 rounded-full"
                        onClick={() => setCurrentPhotoIndex(prev => prev === 0 ? 4 : prev - 1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-10 h-10 rounded-full"
                        onClick={() => setCurrentPhotoIndex(prev => (prev + 1) % 5)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right: Info and Actions */}
                    <div className="w-1/2 p-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        {filterMode === "roommates" && (
                          <Badge className="bg-primary/90 text-primary-foreground w-fit">
                            Looking for Roommate
                          </Badge>
                        )}
                        
                        <div>
                          <h3 className="text-3xl font-bold text-foreground mb-2">
                            {sampleProfiles[currentSwipeProfile]?.name}
                          </h3>
                          <p className="text-lg text-muted-foreground mb-1">
                            Class of {sampleProfiles[currentSwipeProfile]?.year}
                          </p>
                          <p className="text-lg text-muted-foreground mb-4">
                            {sampleProfiles[currentSwipeProfile]?.major}
                          </p>
                          <p className="text-primary font-medium">
                            {meetScope === "school" ? schoolDisplayName : "Worldwide 🌐"}
                          </p>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          "Hey! I'm looking forward to meeting new people and exploring campus together! 🎓"
                        </p>
                      </div>
                      
                      {/* Desktop Action Buttons */}
                      <div className="flex gap-4">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => handleSwipeAction("pass")}
                          className="flex-1 h-14 rounded-2xl border-muted-foreground/30 hover:border-destructive hover:bg-destructive/10"
                        >
                          <X className="h-6 w-6 mr-2" />
                          Skip
                        </Button>
                        
                        <Button
                          size="lg"
                          onClick={() => handleSwipeAction("message")}
                          className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 neon-glow"
                        >
                          <MessageCircle className="h-6 w-6 mr-2" />
                          Message
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => handleSwipeAction("like")}
                          className="flex-1 h-14 rounded-2xl border-primary hover:border-primary hover:bg-primary/10"
                        >
                          <Heart className="h-6 w-6 mr-2 text-primary" />
                          Like
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Mobile Action Buttons - Only show on mobile */}
            {isMobile && (
              <div className="flex justify-center gap-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleSwipeAction("pass")}
                  className="w-16 h-16 rounded-full border-muted-foreground/30 hover:border-destructive hover:bg-destructive/10"
                >
                  <X className="h-6 w-6" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={() => handleSwipeAction("message")}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 neon-glow"
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleSwipeAction("like")}
                  className="w-16 h-16 rounded-full border-primary hover:border-primary hover:bg-primary/10"
                >
                  <Heart className="h-6 w-6 text-primary" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="text-center py-16 animate-fade-in">
            <MessageSquare className="h-20 w-20 text-primary mx-auto mb-6 neon-glow" />
            <h3 className="text-3xl font-bold mb-4 text-foreground">School Chat Rooms</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              {user ? 'Join conversations with your classmates in dedicated chat rooms' : 'Create an account to join school-specific chat rooms and start conversations'}
            </p>
            {user ? (
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl font-bold neon-glow">
                <MessageSquare className="h-5 w-5 mr-2" />
                Join Chat Rooms
              </Button>
            ) : (
              <div className="space-y-6">
                <p className="text-primary font-medium">Account required for chat access</p>
                <Button 
                  onClick={handleCreateAccount}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-2xl font-bold neon-glow"
                >
                  Create Account to Chat
                </Button>
              </div>
            )}
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
                  <h3 className="text-4xl font-black text-[#E4405F] mb-2">@{school}2030class</h3>
                  <p className="text-muted-foreground text-lg">
                    Official Instagram account for {schoolDisplayName} Class of 2030
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open(`https://instagram.com/${school}2030class`, '_blank')}
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
                  <Instagram className="h-6 w-6 mr-3" />
                  📸 Post on {schoolAcronym}'s Insta ($5)
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
                Follow @{school}2030class on Instagram to see student features and campus highlights
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
    </div>
  );
}