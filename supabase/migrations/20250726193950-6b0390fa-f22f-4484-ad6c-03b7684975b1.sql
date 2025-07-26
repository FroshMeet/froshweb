-- Update user_profiles to support new auth flow
ALTER TABLE public.user_profiles 
ADD COLUMN phone_number text,
ADD COLUMN verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'email_verified')),
ADD COLUMN college_email text,
ADD COLUMN auth_provider text DEFAULT 'email' CHECK (auth_provider IN ('email', 'phone', 'google', 'apple'));

-- Update verified column to be computed from verification_status
UPDATE public.user_profiles SET verified = (verification_status = 'email_verified');

-- Create function for college email verification
CREATE OR REPLACE FUNCTION public.verify_college_email(user_id_param uuid, college_email_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  detected_school text;
BEGIN
  -- Detect school from email domain
  detected_school := CASE 
    WHEN college_email_param LIKE '%@bu.edu' THEN 'Boston University'
    WHEN college_email_param LIKE '%@harvard.edu' THEN 'Harvard University'
    WHEN college_email_param LIKE '%@mit.edu' THEN 'MIT'
    WHEN college_email_param LIKE '%@ucla.edu' THEN 'UCLA'
    WHEN college_email_param LIKE '%@berkeley.edu' THEN 'UC Berkeley'
    WHEN college_email_param LIKE '%@stanford.edu' THEN 'Stanford University'
    WHEN college_email_param LIKE '%@yale.edu' THEN 'Yale University'
    WHEN college_email_param LIKE '%@princeton.edu' THEN 'Princeton University'
    WHEN college_email_param LIKE '%@columbia.edu' THEN 'Columbia University'
    WHEN college_email_param LIKE '%@nyu.edu' THEN 'NYU'
    WHEN college_email_param LIKE '%@upenn.edu' THEN 'University of Pennsylvania'
    WHEN college_email_param LIKE '%@northwestern.edu' THEN 'Northwestern University'
    WHEN college_email_param LIKE '%@duke.edu' THEN 'Duke University'
    WHEN college_email_param LIKE '%@umich.edu' THEN 'University of Michigan'
    WHEN college_email_param LIKE '%@usc.edu' THEN 'USC'
    ELSE null
  END;

  -- Update user profile
  UPDATE public.user_profiles 
  SET 
    college_email = college_email_param,
    school = detected_school,
    verification_status = 'email_verified',
    verified = true
  WHERE user_id = user_id_param;

  RETURN true;
END;
$$;