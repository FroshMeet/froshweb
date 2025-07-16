-- Create submissions table for Instagram feature requests
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  major TEXT NOT NULL,
  bio TEXT NOT NULL CHECK (length(bio) <= 100),
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  has_paid BOOLEAN NOT NULL DEFAULT true,
  has_been_posted BOOLEAN NOT NULL DEFAULT false,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Anyone can view submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update submissions" 
ON public.submissions 
FOR UPDATE 
USING (true);

-- Create storage bucket for submissions if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for submissions bucket
CREATE POLICY "Anyone can view submission images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'submissions');

CREATE POLICY "Anyone can upload submission images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'submissions');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();