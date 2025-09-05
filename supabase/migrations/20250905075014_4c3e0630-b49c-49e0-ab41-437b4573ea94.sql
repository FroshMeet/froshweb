-- Add missing pair_key column for DMs to ensure uniqueness
ALTER TABLE public.school_conversations 
ADD COLUMN IF NOT EXISTS pair_key text;

-- Create unique constraint for group chats (one per school)
CREATE UNIQUE INDEX IF NOT EXISTS idx_school_conversations_group_unique 
ON public.school_conversations (school_slug, type) 
WHERE type = 'group';

-- Create unique constraint for DMs (one per pair)
CREATE UNIQUE INDEX IF NOT EXISTS idx_school_conversations_dm_unique 
ON public.school_conversations (pair_key) 
WHERE pair_key IS NOT NULL;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_school_conversations_school_last_message 
ON public.school_conversations (school_slug, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_school_messages_conversation_created 
ON public.school_messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_school_conversation_members_user 
ON public.school_conversation_members (user_id, conversation_id);

-- Update the existing start_school_dm_or_get function to use pair_key
CREATE OR REPLACE FUNCTION public.start_school_dm_or_get(school_slug_param text, user_a_param uuid, user_b_param uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  conversation_id_var UUID;
  user_a_name TEXT;
  user_b_name TEXT;
  pair_key_var TEXT;
BEGIN
  -- Build deterministic pair_key
  pair_key_var := LEAST(user_a_param::text, user_b_param::text) || ':' || GREATEST(user_a_param::text, user_b_param::text) || ':' || school_slug_param;
  
  -- Get existing DM conversation by pair_key
  SELECT c.id INTO conversation_id_var
  FROM public.school_conversations c
  WHERE c.pair_key = pair_key_var AND c.type = 'dm';
  
  -- If not found, create new DM
  IF conversation_id_var IS NULL THEN
    -- Get user names for title
    SELECT display_name INTO user_a_name FROM public.profiles WHERE user_id = user_a_param AND school_slug = school_slug_param;
    SELECT display_name INTO user_b_name FROM public.profiles WHERE user_id = user_b_param AND school_slug = school_slug_param;
    
    -- Create conversation with pair_key
    INSERT INTO public.school_conversations (school_slug, type, title, created_by, pair_key)
    VALUES (school_slug_param, 'dm', user_a_name || ' & ' || user_b_name, user_a_param, pair_key_var)
    RETURNING id INTO conversation_id_var;
    
    -- Add both users as members
    INSERT INTO public.school_conversation_members (conversation_id, user_id)
    VALUES 
      (conversation_id_var, user_a_param),
      (conversation_id_var, user_b_param);
  END IF;
  
  RETURN conversation_id_var;
END;
$function$;

-- Create enhanced RLS policies for the chat system

-- Update profiles policy to allow same-school visibility
DROP POLICY IF EXISTS "Same school users can view basic profiles" ON public.profiles;
CREATE POLICY "Same school users can view basic profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (is_visible = true AND school_slug IN (
    SELECT p.school_slug FROM public.profiles p WHERE p.user_id = auth.uid()
  ))
);

-- Update conversations policy to allow group chat summary access
DROP POLICY IF EXISTS "Users can view school conversations they are members of" ON public.school_conversations;
CREATE POLICY "Users can view conversations they are members of or group summaries" 
ON public.school_conversations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.school_conversation_members cm 
    WHERE cm.conversation_id = id AND cm.user_id = auth.uid()
  ) OR 
  (type = 'group' AND school_slug IN (
    SELECT p.school_slug FROM public.profiles p WHERE p.user_id = auth.uid()
  ))
);

-- Enhanced conversation member policies
CREATE POLICY IF NOT EXISTS "Users can manage their own conversation memberships" 
ON public.school_conversation_members 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow aggregate counts for group chats
CREATE POLICY IF NOT EXISTS "Users can view group chat member counts" 
ON public.school_conversation_members 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.school_conversations c 
    WHERE c.id = conversation_id 
    AND c.type = 'group' 
    AND c.school_slug IN (
      SELECT p.school_slug FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  )
);

-- Enable realtime for chat tables
ALTER TABLE public.school_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.school_messages REPLICA IDENTITY FULL;
ALTER TABLE public.school_conversation_members REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.school_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.school_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.school_conversation_members;