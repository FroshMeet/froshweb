-- Fix search path security issue
CREATE OR REPLACE FUNCTION public.verify_college_email(user_id_param uuid, college_email_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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