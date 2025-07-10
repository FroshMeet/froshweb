import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, ExternalLink, Heart, MessageCircle, Share, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string;
  bio: string;
  class_year: string;
  photos: string[];
  social_links: any;
  school: string;
}

export default function PostToInstagram() {
  const { school } = useParams<{ school: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const profileId = searchParams.get('profileId');
  const schoolInstagram = `@${school}2030class`;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        toast({
          title: "Error",
          description: "No profile ID provided",
          variant: "destructive"
        });
        navigate('/create-profile');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Could not load profile data",
          variant: "destructive"
        });
        navigate('/create-profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, navigate, toast]);

  const handlePayment = async () => {
    if (!profile) return;
    
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions
        .invoke('create-instagram-payment', {
          body: { profileId: profile.id }
        });

      if (error) throw error;

      // Open Stripe checkout
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to payment",
        description: "Complete your payment to get featured on Instagram",
      });

    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment Error",
        description: "Could not process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Profile not found</p>
            <Button onClick={() => navigate('/create-profile')} className="mt-4">
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/${school}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {school?.toUpperCase()} Page
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Instagram className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold">Get Featured on Instagram</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Post your profile to {schoolInstagram} and reach thousands of students
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Instagram Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Instagram Preview</h2>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {school?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{schoolInstagram}</p>
                    <p className="text-xs text-muted-foreground">Sponsored</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Profile Preview */}
                <div className="relative">
                  {profile.photos && profile.photos.length > 0 && (
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6" />
                    <MessageCircle className="h-6 w-6" />
                    <Share className="h-6 w-6" />
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm">{schoolInstagram}</p>
                  <p className="text-sm">
                    Meet {profile.name}, Class of {profile.class_year}! 
                    {profile.bio && ` ${profile.bio}`}
                    <br />
                    <span className="text-blue-600">
                      #{school?.toLowerCase()}2030 #frosh #newstudent
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {profile.photos && profile.photos.length > 0 && (
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <CardDescription>Class of {profile.class_year}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {profile.bio && (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}

                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Social Links:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.social_links).map(([platform, handle]) => (
                        handle && (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}: {handle as string}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      <li>1. Pay $5 to secure your Instagram feature</li>
                      <li>2. Our team manually posts your profile to {schoolInstagram}</li>
                      <li>3. Your profile reaches thousands of students!</li>
                    </ol>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="lg"
                  >
                    {paymentLoading ? "Processing..." : `💳 Pay $5 to Post to ${schoolInstagram}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Secure payment processed by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}