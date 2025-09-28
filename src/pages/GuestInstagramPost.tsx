import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Upload, DollarSign, ArrowLeft, UserPlus } from "lucide-react";
import { getSchoolName } from "@/config/schoolNameMapping";
import { schools } from "@/data/schools";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function GuestInstagramPost() {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    class_year: '',
    instagram_handle: '',
    photos: [] as string[]
  });

  const schoolData = schools.find(s => s.id === school);
  const schoolName = schoolData ? (schoolData.shortName || schoolData.name) : '';
  const schoolDisplayName = schoolName || '';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('instagram-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('instagram-photos')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({ ...prev, photos: uploadedUrls }));
      toast({
        title: "Photos uploaded successfully!",
        description: `${uploadedUrls.length} photo(s) ready for your Instagram post`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload failed",
        description: "Please try uploading your photos again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.class_year || !formData.instagram_handle || formData.photos.length === 0) {
      toast({
        title: "Please complete all required fields",
        description: "Name, class year, Instagram handle, and at least one photo are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First create the profile entry
      const profileData = {
        name: formData.name,
        bio: formData.bio || null,
        class_year: formData.class_year,
        instagram_handle: formData.instagram_handle,
        school: schoolDisplayName || '',
        photos: formData.photos,
        user_id: null, // Guest user
        paid_for_instagram: false, // Will be updated after payment
        posted_to_instagram: false
      };

      const { data: profile, error: profileError } = await supabase
        .from('instagram_profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) throw profileError;

      // Now initiate payment
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-guest-payment',
        {
          body: {
            school: schoolDisplayName || ''
          }
        }
      );

      if (paymentError) throw paymentError;

      // Redirect to Stripe checkout
      if (paymentData?.url) {
        window.open(paymentData.url, '_blank');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/${school}`)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {schoolDisplayName}
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Instagram className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quick Instagram Post
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Get featured on @{school}2030class for just $5 - no account required!
            </p>
            
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 mb-6 border border-primary/30 max-w-md mx-auto">
              <p className="text-sm text-foreground">
                ✨ <strong>Want the full FroshMeet experience?</strong> Create a free account after payment to manage your profile and connect with classmates!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Instagram Post Form ($5)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill out your details to get posted on the official {schoolDisplayName} Instagram account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Photos Upload */}
            <div className="space-y-2">
              <Label htmlFor="photos">Photos (1-3 photos required) *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload 1-3 photos for your Instagram post
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={loading}
                >
                  Choose Photos
                </Button>
              </div>
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.photos.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name or Nickname *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="How you'd like to be known"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Class Year */}
            <div className="space-y-2">
              <Label htmlFor="class_year">Class Year *</Label>
              <Select onValueChange={(value) => handleInputChange('class_year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your graduation year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instagram Handle */}
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle *</Label>
              <Input
                id="instagram"
                value={formData.instagram_handle}
                onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                placeholder="@yourusername"
              />
            </div>

            {/* Payment Button */}
            <div className="pt-6 border-t">
              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-foreground mb-2">
                  Ready to get featured?
                </p>
                <p className="text-sm text-muted-foreground">
                  Your profile will be posted to @{school}2030class within 24 hours
                </p>
              </div>
              
              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                size="lg"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pay $5 & Get Posted
                  </>
                )}
              </Button>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Or Create Free Account First
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}