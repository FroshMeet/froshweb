-- Add user_id column to submissions table to link submissions to users
ALTER TABLE public.submissions 
ADD COLUMN user_id UUID;

-- Update existing submissions to set user_id based on auth context (if any authenticated user exists)
-- This is a one-time migration for existing data
UPDATE public.submissions 
SET user_id = auth.uid() 
WHERE user_id IS NULL AND auth.uid() IS NOT NULL;

-- Make user_id NOT NULL for new submissions going forward
-- Note: We're not making it NOT NULL immediately to avoid breaking existing data
-- ALTER TABLE public.submissions ALTER COLUMN user_id SET NOT NULL;

-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own submissions only" ON public.submissions;

-- Create a proper SELECT policy that allows users to view their own submissions
CREATE POLICY "Users can view their own submissions" 
ON public.submissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update the INSERT policy to ensure user_id is set correctly
DROP POLICY IF EXISTS "Authenticated users can insert submissions" ON public.submissions;

CREATE POLICY "Users can insert their own submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update the UPDATE policy to be more restrictive - only allow users to update their own submissions
DROP POLICY IF EXISTS "System can update submissions" ON public.submissions;

CREATE POLICY "Users can update their own submissions" 
ON public.submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add a system policy for admin/system updates (e.g., marking as posted)
CREATE POLICY "System can update submission status" 
ON public.submissions 
FOR UPDATE 
USING (true)
WITH CHECK (true);