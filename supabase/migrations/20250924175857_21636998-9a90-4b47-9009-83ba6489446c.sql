-- Create waitlist signups table for FreshMeat app
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT at_least_one_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist signups
CREATE POLICY "Anyone can create waitlist signup" 
ON public.waitlist_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view waitlist signups" 
ON public.waitlist_signups 
FOR SELECT 
USING (false); -- No public access to view signups

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_waitlist_signups_updated_at
BEFORE UPDATE ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for school-based queries
CREATE INDEX idx_waitlist_signups_school ON public.waitlist_signups(school);

-- Create function to get signup count by school
CREATE OR REPLACE FUNCTION public.get_school_signup_count(school_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM waitlist_signups
    WHERE school = school_name
  );
END;
$$;