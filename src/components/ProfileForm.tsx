import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/hooks/useProfiles";

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  schoolSlug: string;
  existingProfile?: Profile | null;
  onSave?: () => void;
}

export const ProfileForm = ({ open, onClose, schoolSlug, existingProfile, onSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    class_year: new Date().getFullYear() + 4, // Default to 4 years from now
    bio: '',
    pfp_url: '',
    cover_url: ''
  });
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Populate form with existing profile data
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        username: existingProfile.username,
        full_name: existingProfile.full_name,
        class_year: existingProfile.class_year,
        bio: existingProfile.bio || '',
        pfp_url: existingProfile.pfp_url || '',
        cover_url: existingProfile.cover_url || ''
      });
      setProfileImages(existingProfile.images || []);
    }
  }, [existingProfile]);

  const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'pfp' | 'cover' | 'gallery') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const bucket = type === 'pfp' ? 'avatars' : type === 'cover' ? 'covers' : 'profile_images';
    setUploadingImage(type);
    
    const url = await uploadImage(file, bucket);
    if (url) {
      if (type === 'pfp') {
        setFormData(prev => ({ ...prev, pfp_url: url }));
      } else if (type === 'cover') {
        setFormData(prev => ({ ...prev, cover_url: url }));
      } else if (type === 'gallery') {
        setProfileImages(prev => [...prev, url]);
      }
    }
    
    setUploadingImage(null);
  };

  const removeProfileImage = (index: number) => {
    setProfileImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get school data
      const { data: school } = await supabase
        .from('schools')
        .select('slug')
        .eq('slug', schoolSlug)
        .single();

      if (!school) throw new Error('School not found');

      // Upsert profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: formData.username,
          full_name: formData.full_name,
          class_year: formData.class_year,
          bio: formData.bio,
          pfp_url: formData.pfp_url,
          cover_url: formData.cover_url,
          school_slug: schoolSlug,
          is_visible: true
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Delete existing profile images and insert new ones
      if (existingProfile) {
        await supabase
          .from('profile_images')
          .delete()
          .eq('profile_id', existingProfile.id);
      }

      // Insert new profile images
      if (profileImages.length > 0 && profileData) {
        const imageInserts = profileImages.map((url, index) => ({
          profile_id: profileData.id,
          image_url: url,
          position: index
        }));

        const { error: imagesError } = await supabase
          .from('profile_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      toast({
        title: "Success",
        description: existingProfile ? "Profile updated!" : "Profile created!"
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingProfile ? 'Edit Profile' : 'Create Profile'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="your_username"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your Full Name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="class_year">Class Year</Label>
            <Input
              id="class_year"
              type="number"
              value={formData.class_year}
              onChange={(e) => setFormData(prev => ({ ...prev, class_year: parseInt(e.target.value) }))}
              placeholder="2028"
              required
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          {/* Profile Picture */}
          <div>
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 overflow-hidden flex items-center justify-center">
                {formData.pfp_url ? (
                  <img src={formData.pfp_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {formData.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'pfp')}
                  className="hidden"
                  id="pfp-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('pfp-upload')?.click()}
                  disabled={uploadingImage === 'pfp'}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage === 'pfp' ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <div className="mt-2">
              <div className="w-full h-32 bg-gradient-to-r from-primary to-primary/80 rounded-lg overflow-hidden">
                {formData.cover_url ? (
                  <img src={formData.cover_url} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
                )}
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  className="hidden"
                  id="cover-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  disabled={uploadingImage === 'cover'}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage === 'cover' ? 'Uploading...' : 'Upload Cover'}
                </Button>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div>
            <Label>Photo Gallery</Label>
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-4">
                {profileImages.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeProfileImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {/* Add Image Button */}
                <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('gallery-upload')?.click()}
                    disabled={uploadingImage === 'gallery'}
                    className="h-full w-full"
                  >
                    {uploadingImage === 'gallery' ? (
                      <span>Uploading...</span>
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (existingProfile ? 'Update Profile' : 'Create Profile')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};