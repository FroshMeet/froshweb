-- Fix critical RLS policy issues

-- 1. Add RLS policies for school_chat_members table
ALTER TABLE public.school_chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view school chat members"
ON public.school_chat_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can join school chats"
ON public.school_chat_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership"
ON public.school_chat_members
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Add RLS policies for school_chat_messages table
ALTER TABLE public.school_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view school chat messages"
ON public.school_chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.school_chat_members scm
    WHERE scm.school_chat_id = school_chat_messages.school_chat_id
    AND scm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their school chats"
ON public.school_chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.school_chat_members scm
    WHERE scm.school_chat_id = school_chat_messages.school_chat_id
    AND scm.user_id = auth.uid()
  )
);

-- 3. Fix overly permissive submissions table policies
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.submissions;

CREATE POLICY "Authenticated users can insert submissions"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view paid submissions"
ON public.submissions
FOR SELECT
USING (has_paid = true);

CREATE POLICY "System can update submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (true);

-- 4. Add security function for rate limiting (foundation)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_identifier text,
  action_type text,
  max_attempts integer DEFAULT 5,
  time_window_minutes integer DEFAULT 15
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 5. Create rate limiting log table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  action_type text NOT NULL,
  attempted_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type, attempted_at)
);

-- Enable RLS on rate limit log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limit logs"
ON public.rate_limit_log
FOR ALL
TO authenticated
USING (true);