import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Instagram, ExternalLink, Users, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getSchoolName } from '@/config/schoolNameMapping';
import { schools } from '@/data/schools';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { getSchoolByApprovedSlug, getApprovedSchoolData } from '@/utils/schoolNavigation';
import { SchoolPageSEO } from '@/components/seo/SchoolPageSEO';

interface InstagramProfile {
  id: string;
  name: string;
  instagram_handle: string;
  class_year: string;
  bio: string;
  photos: string[];
  school: string;
  created_at: string;
}

export default function SchoolInstagramPosts() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get school data using reverse lookup for proper mapping
  const schoolData = getSchoolByApprovedSlug(school as string);
  const approvedSchoolData = schoolData ? getApprovedSchoolData(schoolData) : null;
  const finalDisplayName = (schoolData ? (schoolData.shortName || schoolData.name) : '') ||
                          approvedSchoolData?.displayName || 
                          school || '';

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('school', finalDisplayName)
          .eq('paid_for_instagram', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [finalDisplayName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              navigate('/community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              navigate('/community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SchoolPageSEO 
        schoolName={finalDisplayName}
        schoolSlug={school || ''}
        studentCount={profiles.length}
      />
      
      <h1 className="sr-only">Meet the {finalDisplayName} Class of 2030 on Instagram</h1>
      
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            navigate('/community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{finalDisplayName} Instagram Features</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Meet students featured on @{school}2030class Instagram account
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{profiles.length} featured students</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <Instagram className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No profiles yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first student from {finalDisplayName} to get featured!
            </p>
            <Button onClick={() => window.location.href = '/create-profile'}>
              Create Your Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {profile.photos && profile.photos.length > 0 && (
                    <div className="aspect-square relative">
                      <img
                        src={profile.photos[0]}
                        alt={`${profile.name}, ${finalDisplayName} Class of ${profile.class_year} student profile photo`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {profile.photos.length > 1 && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 right-2 bg-black/50 text-white"
                        >
                          +{profile.photos.length - 1} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <CardDescription>Class of {profile.class_year}</CardDescription>
                    </div>
                    <Badge variant="outline">{finalDisplayName}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {profile.bio}
                    </p>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`https://instagram.com/${profile.instagram_handle}`, '_blank')}
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    @{profile.instagram_handle}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                  
                  {profile.photos && profile.photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-1 mt-3">
                      {profile.photos.slice(1, 4).map((photo, index) => (
                        <div key={index} className="aspect-square">
                          <img
                            src={photo}
                            alt={`${profile.name} photo ${index + 2}`}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Want to get featured on @{school}2030class?
          </p>
          <Button onClick={() => window.location.href = '/create-profile'}>
            Create Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
}