import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Search, 
  ExternalLink, 
  Smartphone, 
  Users, 
  MessageSquare, 
  Star,
  Heart,
  Globe,
  Zap,
  QrCode,
  ArrowRight,
  Play
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolName } from "@/config/schoolNameMapping";
import { getApprovedSchool } from "@/config/approvedSchools";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSchoolLogo } from "@/utils/schoolLogos";
import { useToast } from "@/hooks/use-toast";
import SchoolFooter from "@/components/layout/SchoolFooter";

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface StudentProfile {
  id: string;
  name: string;
  major: string;
  class_year: string;
  bio?: string;
  instagram_handle?: string;
  photos: string[];
  interests?: string[];
}

export default function SchoolCampusHub() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Get school data
  const approvedSchool = school ? getApprovedSchool(school) : null;
  const schoolName = approvedSchool?.displayName || (school ? getSchoolName(school) : '');
  const instagramHandle = approvedSchool?.instagramUsername;
  const schoolLogo = getSchoolLogo(schoolName || school || '');

  // Mock follower count - in production, this would come from Instagram API
  useEffect(() => {
    setFollowerCount(Math.floor(Math.random() * 2000) + 500);
  }, []);

  // Scroll listener for sticky button
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock Instagram posts - in production, integrate with Instagram Graph API
  useEffect(() => {
    const mockPosts: InstagramPost[] = [
      {
        id: '1',
        caption: 'Welcome to campus! 🎓 #ClassOf2030',
        media_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=500&fit=crop',
        permalink: 'https://instagram.com/p/example1',
        media_type: 'IMAGE'
      },
      {
        id: '2', 
        caption: 'Study group forming! 📚✨',
        media_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=500&fit=crop',
        permalink: 'https://instagram.com/p/example2',
        media_type: 'IMAGE'
      },
      {
        id: '3',
        caption: 'Campus life is amazing! 🌟',
        media_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=500&fit=crop',
        permalink: 'https://instagram.com/p/example3',
        media_type: 'IMAGE'
      }
    ];
    setInstagramPosts(mockPosts);
  }, []);

  // Fetch student directory data
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      if (!school) return;
      
      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', school.toUpperCase())
          .eq('paid_for_instagram', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        
        const profiles: StudentProfile[] = (data || []).map(profile => ({
          id: profile.id,
          name: profile.name,
          major: 'Student', // Default since major not in instagram_profiles
          class_year: profile.class_year,
          bio: profile.bio,
          instagram_handle: profile.instagram_handle,
          photos: profile.photos || []
        }));
        
        setStudentProfiles(profiles);
      } catch (error) {
        console.error('Error fetching student profiles:', error);
      }
    };

    fetchStudentProfiles();
  }, [school]);

  // Search functionality with debounce
  const searchStudents = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = studentProfiles.filter(profile =>
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.major.toLowerCase().includes(query.toLowerCase()) ||
        profile.instagram_handle?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  }, [studentProfiles]);

  useEffect(() => {
    searchStudents(searchQuery);
  }, [searchQuery, searchStudents]);

  const handleOpenApp = () => {
    // Deep link to app or app store
    window.open('/app', '_blank');
  };

  const handleTextMeApp = () => {
    setShowPhoneModal(true);
  };

  const handleSendSMSLink = () => {
    if (!phoneNumber) return;
    
    // In production, integrate with SMS service
    toast({
      title: "SMS Sent! 📱",
      description: "Check your phone for the FroshMeet app link."
    });
    setShowPhoneModal(false);
    setPhoneNumber("");
  };

  const handleGetFeatured = () => {
    // Navigate to Stripe checkout for school-specific featured listing
    navigate(`/${school}/guest-post-to-insta`);
  };

  const handleViewInstagram = (handle: string) => {
    window.open(`https://instagram.com/${handle.replace('@', '')}`, '_blank');
  };

  if (!approvedSchool && school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">School Not Found</h1>
          <p className="text-muted-foreground mb-6">
            "{school}" is not available on FroshMeet yet.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-20 right-16 w-1 h-1 bg-primary/60 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-50"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* School Logo */}
          <div className="mb-8 flex justify-center">
            <div className={`h-20 w-20 bg-gradient-to-br ${schoolLogo} rounded-2xl flex items-center justify-center shadow-lg border-2 border-primary/20`}>
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {schoolName.charAt(0)}
              </span>
            </div>
          </div>

          {/* School Name & Class */}
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4 tracking-tight">
            {schoolName}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="text-primary border-primary/30 px-4 py-2 text-lg font-bold">
              Class of 2030
            </Badge>
          </div>

          {/* Instagram Handle with Follower Count */}
          {instagramHandle && (
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => handleViewInstagram(instagramHandle)}
                className="group border-primary/30 text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                <Instagram className="h-5 w-5 mr-2" />
                @{instagramHandle}
                <Badge variant="secondary" className="ml-2 bg-primary/10">
                  {followerCount.toLocaleString()} followers
                </Badge>
                <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          )}

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleOpenApp}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 neon-glow"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Open in App
            </Button>
            <Button
              onClick={handleTextMeApp}
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Text Me the App
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Recent Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Latest from Campus
            </h2>
            <p className="text-muted-foreground text-lg">
              See what your classmates are sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {instagramPosts.map((post) => (
              <Card 
                key={post.id}
                className="group cursor-pointer overflow-hidden bg-card/50 border-border/40 hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
                onClick={() => window.open(post.permalink, '_blank')}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={post.media_url}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {post.caption}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => instagramHandle && handleViewInstagram(instagramHandle)}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-bold"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Follow on Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Get Featured Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-primary/20 p-8 rounded-3xl">
            <CardContent className="p-0">
              <Star className="h-12 w-12 text-primary mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Be Seen by Your Classmates
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Get featured on @{instagramHandle || `${school}2030class`} and connect with thousands of incoming students.
                Stand out before day one!
              </p>
              <Button
                onClick={handleGetFeatured}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 neon-glow"
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Featured
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Discover Students
            </h2>
            <p className="text-muted-foreground text-lg">
              Search by name, major, interests, or @handle
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-border/40 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-12">
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {searchResults.map((profile) => (
                      <Card key={profile.id} className="group overflow-hidden bg-card/50 border-border/40 hover:bg-card/70 transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                              <span className="text-primary font-bold">
                                {profile.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {profile.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {profile.major} • Class of {profile.class_year}
                              </p>
                            </div>
                          </div>
                          {profile.bio && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {profile.bio}
                            </p>
                          )}
                          {profile.instagram_handle && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewInstagram(profile.instagram_handle!)}
                              className="w-full border-primary/30 text-primary hover:bg-primary/10"
                            >
                              <Instagram className="h-4 w-4 mr-2" />
                              @{profile.instagram_handle}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={handleOpenApp}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      DM them in the app
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-muted/10 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Why Join FroshMeet?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Swipe to match classmates before Day 1
              </h3>
              <p className="text-muted-foreground">
                Connect with your future best friends and study partners before you even step on campus.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Auto-sorted group chats
              </h3>
              <p className="text-muted-foreground">
                Join chats organized by dorms, majors, and interests. Never eat alone again.
              </p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Verified, school-specific communities
              </h3>
              <p className="text-muted-foreground">
                Connect only with real students from your school. Safe, verified, and authentic.
              </p>
            </div>
          </div>

          {/* App Store Badges & QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex gap-4">
              <Button
                onClick={handleOpenApp}
                variant="outline"
                className="border-border/40 bg-card/50 hover:bg-card/70 px-6 py-3 rounded-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Google Play
              </Button>
              <Button
                onClick={handleOpenApp}
                variant="outline"
                className="border-border/40 bg-card/50 hover:bg-card/70 px-6 py-3 rounded-xl"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                App Store
              </Button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <QrCode className="h-5 w-5" />
              <span className="text-sm">or scan QR code</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky App Button */}
      {showStickyButton && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Button
            onClick={handleOpenApp}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-full font-bold shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 neon-glow"
          >
            <Smartphone className="h-5 w-5 mr-2" />
            Open in App
          </Button>
        </div>
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Get the App Link
              </h3>
              <p className="text-muted-foreground mb-6">
                Enter your phone number and we'll text you a link to download FroshMeet.
              </p>
              <div className="space-y-4">
                <Input
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleSendSMSLink}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!phoneNumber}
                  >
                    Send Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPhoneModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Footer */}
      <SchoolFooter currentSchool={school} />
    </div>
  );
}