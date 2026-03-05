-- Create posts table for the new submission flow (no auth required)
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  school TEXT NOT NULL,
  school_slug TEXT NOT NULL,
  bio TEXT,
  class_year TEXT NOT NULL,
  image_urls TEXT[] NOT NULL DEFAULT '{}'::text[],
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone can insert posts (no auth required for frictionless flow)
CREATE POLICY "Anyone can create posts" ON public.posts FOR INSERT WITH CHECK (true);

-- Only admins can view/manage posts
CREATE POLICY "Admins can view all posts" ON public.posts FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update posts" ON public.posts FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete posts" ON public.posts FOR DELETE USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage policies - anyone can upload post images
CREATE POLICY "Anyone can upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images');
CREATE POLICY "Post images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');