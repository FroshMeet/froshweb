import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Instagram, ExternalLink, ArrowLeft, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSchoolName } from "@/config/schoolNameMapping";
import { schools } from "@/data/schools";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";


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

export default function SchoolPage() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // First try to get from approved schools (which has correct display names)
  const approvedSchoolData = APPROVED_SCHOOLS[school as string];
  const schoolDisplayName = approvedSchoolData?.displayName || '';
  
  // Fallback to schools data if not in approved schools
  const schoolData = schools.find(s => s.id === school);
  const fallbackName = schoolData ? (schoolData.shortName || schoolData.name) : '';
  const finalDisplayName = schoolDisplayName || fallbackName;

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!school) return;
      
      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', school)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-8">
            {/* School Icon */}
            <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-3xl flex items-center justify-center mx-auto">
              <span className="text-primary font-bold text-3xl">
                {schoolDisplayName.charAt(0)}
              </span>
            </div>
            
            {/* Title Section */}
            <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              {finalDisplayName}
            </h1>
            <div className="w-16 h-0.5 bg-primary mx-auto"></div>
            <p className="text-lg text-primary font-medium tracking-wide uppercase">
              {finalDisplayName}
            </p>
            </div>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with fellow students and build lasting friendships in your {finalDisplayName} community.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">{profiles.length} students connected</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => navigate('/create-profile')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your Profile
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(`/${school}/insta/posts`)}
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10 font-semibold px-8 py-3"
              >
                <Instagram className="h-5 w-5 mr-2" />
                View Instagram Features
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Want to get featured on Instagram? Tap any profile below or create your own to see how!
          </p>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No students yet!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Be the first student from {finalDisplayName} to join the community and connect with your peers.
            </p>
            <Button 
              onClick={() => navigate('/create-profile')}
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create the First Profile
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Meet Your Fellow Students</h2>
              <p className="text-muted-foreground">
                Connect with {profiles.length} students from {finalDisplayName}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(`/post-to-insta?profileId=${profile.id}&school=${school}`)}
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
                        {finalDisplayName}
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
                      <span>Click to see Instagram options</span>
                      <Heart className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12 pt-8 border-t">
              <p className="text-muted-foreground mb-4">
                Ready to join the {finalDisplayName} community?
              </p>
              <Button 
                onClick={() => navigate('/create-profile')}
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your Profile
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}