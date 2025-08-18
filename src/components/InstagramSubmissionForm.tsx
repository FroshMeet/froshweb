import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { APPROVED_SCHOOLS } from '@/config/approvedSchools';
import { validateAndSanitizeInput, validateFileUpload } from '@/utils/security';

interface FormData {
  name: string;
  school: string;
  major: string;
  bio: string;
  photos: File[];
}

export const InstagramSubmissionForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    school: '',
    major: '',
    bio: '',
    photos: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 20) {
      toast.error('Maximum 20 photos allowed');
      return;
    }
    setFormData(prev => ({ ...prev, photos: files }));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const uploadPromises = formData.photos.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sessionId}-${index}.${fileExt}`;
      const filePath = `submissions/${fileName}`;
      
      const { error } = await supabase.storage
        .from('submissions')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };

  // Enhanced validation and security
  const validateSubmission = (): { isValid: boolean; message?: string } => {
    // Validate name
    const nameValidation = validateAndSanitizeInput(formData.name, {
      minLength: 1,
      maxLength: 100,
      fieldName: 'Name',
      checkContent: true
    });
    if (!nameValidation.isValid) {
      return { isValid: false, message: nameValidation.message };
    }

    if (!formData.school) {
      return { isValid: false, message: 'Please select a school' };
    }

    // Validate major
    const majorValidation = validateAndSanitizeInput(formData.major, {
      minLength: 1,
      maxLength: 100,
      fieldName: 'Major',
      checkContent: true
    });
    if (!majorValidation.isValid) {
      return { isValid: false, message: majorValidation.message };
    }

    // Validate bio
    const bioValidation = validateAndSanitizeInput(formData.bio, {
      minLength: 0,
      maxLength: 100,
      fieldName: 'Bio',
      checkContent: true
    });
    if (!bioValidation.isValid) {
      return { isValid: false, message: bioValidation.message };
    }

    if (formData.photos.length === 0) {
      return { isValid: false, message: 'Please upload at least one photo' };
    }

    if (formData.photos.length > 20) {
      return { isValid: false, message: 'Maximum 20 photos allowed' };
    }

    // Validate each photo
    for (const photo of formData.photos) {
      const fileValidation = validateFileUpload(photo);
      if (!fileValidation.isValid) {
        return { isValid: false, message: fileValidation.message };
      }
    }

    return { isValid: true };
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSubmission();
    if (!validation.isValid) {
      toast.error(validation.message || 'Please check your submission');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos to storage
      const imageUrls = await uploadPhotos();
      
      // Save submission to database with sanitized data
      const nameValidation = validateAndSanitizeInput(formData.name, { fieldName: 'Name' });
      const majorValidation = validateAndSanitizeInput(formData.major, { fieldName: 'Major' });
      const bioValidation = validateAndSanitizeInput(formData.bio, { fieldName: 'Bio' });
      
      const { error } = await supabase
        .from('submissions')
        .insert({
          name: nameValidation.sanitized,
          school: formData.school,
          major: majorValidation.sanitized,
          bio: bioValidation.sanitized,
          image_urls: imageUrls,
          stripe_session_id: sessionId,
          has_paid: true,
          has_been_posted: false
        });

      if (error) throw error;

      toast.success('Submission completed! We\'ll review and post your feature soon.');
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Invalid session. Please complete payment first.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Instagram Feature Submission
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Fill out the details below to be featured on your school's Instagram
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="school">School *</Label>
              <Select value={formData.school} onValueChange={(value) => handleInputChange('school', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(APPROVED_SCHOOLS).map(([slug, school]) => (
                    <SelectItem key={slug} value={school.name}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="major">Major *</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                placeholder="Enter your major"
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Short Bio * (max 100 characters)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Write a short bio about yourself"
                maxLength={100}
                className="resize-none"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.bio.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="photos">Upload Photos * (1-20 images)</Label>
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-2"
                required
              />
              {formData.photos.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.photos.length} photo(s) selected
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Feature'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};