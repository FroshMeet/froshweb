import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  school: string;
  name: string;
  instagram_handle: string;
  class_year: string;
  bio: string;
  photos: File[];
}

const SCHOOLS = [
  'UCLA', 'USC', 'Stanford', 'Berkeley', 'UCSB', 'UCSD', 'UCI',
  'NYU', 'Columbia', 'Harvard', 'MIT', 'Yale', 'Princeton',
  'Michigan', 'Ohio State', 'Penn State', 'Texas', 'Florida'
];

const CLASS_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

export default function InstagramProfileForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    school: '',
    name: '',
    instagram_handle: '',
    class_year: '',
    bio: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = formData.photos.length;
    const totalPhotos = currentPhotos + files.length;
    
    if (totalPhotos > 3) {
      toast({
        title: "Too many photos",
        description: "You can upload maximum 3 photos",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    
    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPhotoPreviewUrls(prev => [...prev, url]);
    });
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string, profileId: string): Promise<string[]> => {
    const uploadPromises = formData.photos.map(async (photo, index) => {
      const fileName = `${userId}/${profileId}_${index}_${Date.now()}.jpg`;
      
      const { error } = await supabase.storage
        .from('instagram-photos')
        .upload(fileName, photo);

      if (error) throw error;

      const { data } = supabase.storage
        .from('instagram-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.school || !formData.name || !formData.instagram_handle || !formData.class_year) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.photos.length === 0) {
      toast({
        title: "No photos",
        description: "Please upload at least one photo",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create the profile first
      const { data: profile, error: profileError } = await supabase
        .from('instagram_profiles')
        .insert({
          user_id: user.id,
          school: formData.school,
          name: formData.name,
          instagram_handle: formData.instagram_handle.replace('@', ''),
          class_year: formData.class_year,
          bio: formData.bio,
          photos: [], // Will update after photo upload
          is_paid: false
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Upload photos
      const photoUrls = await uploadPhotos(user.id, profile.id);

      // Update profile with photo URLs
      const { error: updateError } = await supabase
        .from('instagram_profiles')
        .update({ photos: photoUrls })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Create payment session
      const { data: paymentData, error: paymentError } = await supabase.functions
        .invoke('create-instagram-payment', {
          body: { profileId: profile.id }
        });

      if (paymentError) throw paymentError;

      // Redirect to Stripe checkout
      window.open(paymentData.url, '_blank');

      toast({
        title: "Profile created!",
        description: "Complete your payment to get featured on Instagram",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Instagram className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Create Instagram Profile</CardTitle>
            </div>
            <CardDescription>
              Create your profile to get featured on your school's Instagram account for $5
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school">School *</Label>
                <Select value={formData.school} onValueChange={(value) => handleInputChange('school', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOLS.map(school => (
                      <SelectItem key={school} value={school}>{school}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle *</Label>
                <Input
                  id="instagram"
                  value={formData.instagram_handle}
                  onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Class Year *</Label>
                <Select value={formData.class_year} onValueChange={(value) => handleInputChange('class_year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_YEARS.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Photos (1-3 required) *</Label>
                <div className="space-y-4">
                  {formData.photos.length < 3 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground mb-2">
                        Upload your photos ({formData.photos.length}/3)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          Choose Photos
                        </label>
                      </Button>
                    </div>
                  )}
                  
                  {photoPreviewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Profile & Pay $5"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}