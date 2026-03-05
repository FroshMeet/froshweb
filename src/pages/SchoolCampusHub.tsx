import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Building2, 
  GraduationCap,
  MessageCircle,
  UserPlus,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { schools } from "@/data/schools";
import { getSchoolByApprovedSlug, getApprovedSchoolData } from "@/utils/schoolNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSchoolLogo } from "@/utils/schoolLogos";
import { getSchoolImageUrl, hasSchoolImage } from "@/utils/schoolImages";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";
import { SchoolPageSEO } from "@/components/seo/SchoolPageSEO";
import InstagramSection from "@/components/InstagramSection";

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

// School metadata - in production this would come from a database
const SCHOOL_METADATA: Record<string, { location?: string; type?: string; size?: string }> = {
  'harvard': { location: 'Cambridge, MA', type: 'Private', size: '~7,000 undergrads' },
  'stanford': { location: 'Stanford, CA', type: 'Private', size: '~8,000 undergrads' },
  'mit': { location: 'Cambridge, MA', type: 'Private', size: '~4,500 undergrads' },
  'ucla': { location: 'Los Angeles, CA', type: 'Public', size: '~32,000 undergrads' },
  'ucberkeley': { location: 'Berkeley, CA', type: 'Public', size: '~31,000 undergrads' },
  'usc': { location: 'Los Angeles, CA', type: 'Private', size: '~21,000 undergrads' },
  'nyu': { location: 'New York, NY', type: 'Private', size: '~28,000 undergrads' },
  'columbia': { location: 'New York, NY', type: 'Private', size: '~8,000 undergrads' },
  'yale': { location: 'New Haven, CT', type: 'Private', size: '~6,500 undergrads' },
  'princeton': { location: 'Princeton, NJ', type: 'Private', size: '~5,500 undergrads' },
  'upenn': { location: 'Philadelphia, PA', type: 'Private', size: '~10,000 undergrads' },
  'duke': { location: 'Durham, NC', type: 'Private', size: '~6,700 undergrads' },
  'northwestern': { location: 'Evanston, IL', type: 'Private', size: '~8,500 undergrads' },
  'umich': { location: 'Ann Arbor, MI', type: 'Public', size: '~32,000 undergrads' },
};

export default function SchoolCampusHub() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Get school data
  const schoolData = getSchoolByApprovedSlug(school as string);
  const approvedSchool = schoolData ? getApprovedSchoolData(schoolData) : null;
  const schoolName = (schoolData ? (schoolData.shortName || schoolData.name) : '') ||
                    approvedSchool?.displayName || 
                    school || '';
  const instagramHandle = approvedSchool?.instagramUsername;
  const schoolLogo = getSchoolLogo(schoolName || school || '');
  const schoolMeta = SCHOOL_METADATA[school || ''];

  // Fetch student profiles
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      if (!school) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', school)
          .eq('paid_for_instagram', true)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        const profiles: StudentProfile[] = (data || []).map(profile => ({
          id: profile.id,
          name: profile.name,
          major: 'Student',
          class_year: profile.class_year,
          bio: profile.bio,
          instagram_handle: profile.instagram_handle,
          photos: profile.photos || []
        }));
        setStudentProfiles(profiles);
      } catch (error) {
        console.error('Error fetching student profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentProfiles();
  }, [school]);

  // Search functionality
  const searchStudents = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      const filtered = studentProfiles.filter(profile => 
        profile.name.toLowerCase().includes(query.toLowerCase()) || 
        profile.instagram_handle?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  }, [studentProfiles]);

  useEffect(() => {
    searchStudents(searchQuery);
  }, [searchQuery, searchStudents]);

  const handleOpenApp = () => navigate('/waitlist');
  
  const handleTextMeApp = () => setShowPhoneModal(true);
  
  const handleSendSMSLink = () => {
    if (!phoneNumber) return;
    toast({
      title: "SMS Sent! 📱",
      description: "Check your phone for the FroshMeet app link."
    });
    setShowPhoneModal(false);
    setPhoneNumber("");
  };

  const handleGetFeatured = () => navigate(`/${school}/guest-post-to-insta`);
  
  const handleViewInstagram = (handle: string) => {
    window.open(`https://instagram.com/${handle.replace('@', '')}`, '_blank');
  };

  const handleSchoolSwitch = (schoolSlug: string) => {
    if (schoolSlug && schoolSlug !== school) {
      navigate(`/${schoolSlug}`);
    }
  };

  // 404 for unsupported schools
  if (!approvedSchool && school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-foreground mb-4">School Not Found</h1>
          <p className="text-muted-foreground mb-6">
            "{school}" is not available on Frosh yet.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const profilesToShow = searchQuery ? searchResults : studentProfiles;

  return (
    <div className="min-h-screen bg-background">
      <SchoolPageSEO 
        schoolName={schoolName}
        schoolSlug={school || ''}
        studentCount={studentProfiles.length}
      />
      
      <h1 className="sr-only">Meet the {schoolName} Class of 2030</h1>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/community')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Schools
          </Button>
          
          {/* School Switcher */}
          <Select value={school || ""} onValueChange={handleSchoolSwitch}>
            <SelectTrigger className="w-[180px] bg-muted/30 border-border/40">
              <SelectValue placeholder="Switch school..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/40 max-h-[300px]">
              {schools.map((schoolOption) => {
                const approvedSchoolData = APPROVED_SCHOOLS[schoolOption.id];
                if (!approvedSchoolData) return null;
                return (
                  <SelectItem key={schoolOption.id} value={schoolOption.id}>
                    {schoolOption.shortName || schoolOption.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          {/* School Logo */}
          <div className="mb-6 flex justify-center">
            {schoolData && hasSchoolImage(schoolData.id) ? (
              <img 
                src={getSchoolImageUrl(schoolData.id)!} 
                alt={`${schoolName} profile`}
                className="h-40 w-40 md:h-48 md:w-48 rounded-2xl object-cover shadow-lg border border-primary/20"
              />
            ) : (
              <div className={`h-40 w-40 md:h-48 md:w-48 bg-gradient-to-br ${schoolLogo} rounded-2xl flex items-center justify-center shadow-lg border border-primary/20`}>
                <span className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-lg">
                  {schoolName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* School Name */}
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-3 tracking-tight">
            {schoolName}
          </h2>
          
          {/* Class Badge */}
          <Badge variant="outline" className="text-primary border-primary/30 px-4 py-1.5 text-sm font-semibold mb-4">
            Class of 2030
          </Badge>

          {/* Descriptor Line */}
          <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
            Your incoming Class of 2030 community at {schoolName}
          </p>

          {/* Instagram Handle */}
          {instagramHandle && (
            <Button 
              variant="ghost" 
              onClick={() => handleViewInstagram(instagramHandle)} 
              className="text-primary hover:text-primary/80 hover:bg-primary/5 mb-8"
            >
              <Instagram className="h-4 w-4 mr-2" />
              @{instagramHandle}
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-60" />
            </Button>
          )}

          {/* Primary CTA */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGetFeatured} 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 rounded-full font-semibold shadow-lg shadow-primary/15"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Post to {schoolName}
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      {instagramHandle && (
        <InstagramSection schoolName={schoolName} instagramHandle={instagramHandle} />
      )}

      {/* School Overview Card */}
      {schoolMeta && (
        <section className="py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/30 border-border/30 rounded-2xl">
              <CardContent className="py-6 px-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  About {schoolName}
                </h3>
                <div className="flex flex-wrap gap-6 text-sm">
                  {schoolMeta.location && (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      {schoolMeta.location}
                    </div>
                  )}
                  {schoolMeta.type && (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Building2 className="h-4 w-4 text-primary/70" />
                      {schoolMeta.type}
                    </div>
                  )}
                  {schoolMeta.size && (
                    <div className="flex items-center gap-2 text-foreground/80">
                      <GraduationCap className="h-4 w-4 text-primary/70" />
                      {schoolMeta.size}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}


      {/* Discover Students */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Discover Students</h2>
            <p className="text-muted-foreground">Find your future classmates</p>
          </div>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="pl-11 py-3 rounded-full border-border/40 bg-muted/30 focus:bg-card"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : profilesToShow.length > 0 ? (
            <>
              {/* Student Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {profilesToShow.map(profile => (
                  <Card 
                    key={profile.id} 
                    className="bg-card/50 border-border/40 hover:bg-card/70 transition-all duration-200 rounded-xl overflow-hidden"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {profile.photos[0] ? (
                          <img 
                            src={profile.photos[0]} 
                            alt={profile.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                            <span className="text-primary font-semibold text-lg">
                              {profile.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">Class of {profile.class_year}</p>
                          {profile.bio && (
                            <p className="text-sm text-muted-foreground/80 mt-2 line-clamp-2">{profile.bio}</p>
                          )}
                        </div>
                      </div>
                      {profile.instagram_handle && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewInstagram(profile.instagram_handle!)}
                          className="w-full mt-4 text-primary hover:bg-primary/10"
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          @{profile.instagram_handle}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* DM CTA */}
              <div className="text-center">
                <Button 
                  onClick={handleOpenApp} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  DM them in the app
                </Button>
              </div>
            </>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found for "{searchQuery}"</p>
            </div>
          ) : (
            /* Empty State */
            <Card className="bg-card/50 border-border/40 rounded-2xl">
              <CardContent className="py-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">No students have joined this school yet</p>
                <p className="text-muted-foreground text-sm">
                  Be one of the first to post your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Groups & Chats Preview */}
      <section className="py-12 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Groups & Chats</h2>
            <p className="text-muted-foreground">Connect with your community</p>
          </div>

          <Card className="bg-card/30 border-border/30 rounded-2xl">
            <CardContent className="py-10 text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-1">Group chats will appear here once students join</p>
              <p className="text-muted-foreground/60 text-sm">Dorm chats • Major groups • Interest communities</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Different School Switcher */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-widest">Different School?</p>
          <Select onValueChange={(slug) => navigate(`/${slug}`)}>
            <SelectTrigger className="w-full rounded-full border-border/40 bg-card/50 text-foreground h-14 text-base font-medium px-6">
              <SelectValue placeholder="Switch to another school" />
            </SelectTrigger>
            <SelectContent className="max-h-64 bg-card border-border/40 rounded-2xl">
              {schools
                .filter(s => s.id !== school)
                .map(s => (
                  <SelectItem key={s.id} value={s.id} className="text-foreground hover:bg-primary/10 cursor-pointer">
                    {s.shortName || s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Get the App Link</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Enter your phone number and we'll text you a link to download Frosh.
              </p>
              <div className="space-y-4">
                <Input 
                  placeholder="(555) 123-4567" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
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
                  <Button variant="outline" onClick={() => setShowPhoneModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
