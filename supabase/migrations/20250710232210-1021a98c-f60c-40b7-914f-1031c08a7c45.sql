-- Update the instagram_profiles table to better handle the two-stage flow
ALTER TABLE public.instagram_profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB,
ADD COLUMN IF NOT EXISTS posted_to_instagram BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS instagram_payment_date TIMESTAMP WITH TIME ZONE;

-- Update the column name for clarity
ALTER TABLE public.instagram_profiles 
RENAME COLUMN is_paid TO paid_for_instagram;

-- Update the RLS policy name to match new column
DROP POLICY IF EXISTS "Public can view paid profiles" ON public.instagram_profiles;

-- Create new policy for public viewing of all profiles (since they're all free to display)
CREATE POLICY "Public can view all profiles" ON public.instagram_profiles
  FOR SELECT USING (true);

-- Create policy specifically for Instagram paid profiles
CREATE POLICY "Public can view instagram paid profiles" ON public.instagram_profiles
  FOR SELECT USING (paid_for_instagram = true);

-- Add index for better performance on school queries
CREATE INDEX IF NOT EXISTS idx_instagram_profiles_school ON public.instagram_profiles(school);
CREATE INDEX IF NOT EXISTS idx_instagram_profiles_paid ON public.instagram_profiles(paid_for_instagram);