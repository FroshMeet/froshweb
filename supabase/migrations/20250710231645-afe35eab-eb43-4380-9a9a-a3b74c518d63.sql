-- Create profiles table for Instagram posts
CREATE TABLE public.instagram_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  name TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  class_year TEXT NOT NULL,
  bio TEXT,
  photos TEXT[], -- Array of photo URLs
  is_paid BOOLEAN NOT NULL DEFAULT false,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.instagram_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profiles
CREATE POLICY "Users can view own profiles" ON public.instagram_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profiles
CREATE POLICY "Users can insert own profiles" ON public.instagram_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update own profiles" ON public.instagram_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow public read access to paid profiles for display pages
CREATE POLICY "Public can view paid profiles" ON public.instagram_profiles
  FOR SELECT USING (is_paid = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_instagram_profiles_updated_at
    BEFORE UPDATE ON public.instagram_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('instagram-photos', 'instagram-photos', true);

-- Create storage policies for photo uploads
CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'instagram-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'instagram-photos');