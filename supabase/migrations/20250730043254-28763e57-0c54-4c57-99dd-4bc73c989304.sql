-- Fix security warning: Function Search Path Mutable
-- Update the rate limiting function to set search_path

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_identifier text,
  action_type text,
  max_attempts integer DEFAULT 5,
  time_window_minutes integer DEFAULT 15
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- This is a foundation for rate limiting - implementation can be enhanced
  -- For now, we'll allow all requests but log the pattern
  INSERT INTO public.rate_limit_log (identifier, action_type, attempted_at)
  VALUES (user_identifier, action_type, now())
  ON CONFLICT DO NOTHING;
  
  RETURN true;
END;
$$;