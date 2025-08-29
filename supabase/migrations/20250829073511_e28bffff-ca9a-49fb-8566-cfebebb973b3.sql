-- Function: Get or create group chat for a school
CREATE OR REPLACE FUNCTION public.get_or_create_school_group_chat(school_slug_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  chat_id UUID;
  school_name_var TEXT;
BEGIN
  -- Get school name
  SELECT name INTO school_name_var FROM public.schools WHERE slug = school_slug_param;
  
  -- Try to get existing group chat
  SELECT id INTO chat_id 
  FROM public.school_conversations 
  WHERE school_slug = school_slug_param AND type = 'group';
  
  -- If not found, create it
  IF chat_id IS NULL THEN
    INSERT INTO public.school_conversations (school_slug, type, title, created_by)
    VALUES (school_slug_param, 'group', school_name_var || ' Group Chat', auth.uid())
    RETURNING id INTO chat_id;
  END IF;
  
  RETURN chat_id;
END;
$$;

-- Function: Get group chat summary
CREATE OR REPLACE FUNCTION public.get_school_group_chat_summary(school_slug_param TEXT, user_id_param UUID)
RETURNS TABLE(conversation_id UUID, title TEXT, member_count BIGINT, is_member BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  chat_id UUID;
BEGIN
  -- Get or create the group chat
  SELECT public.get_or_create_school_group_chat(school_slug_param) INTO chat_id;
  
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    c.title,
    COALESCE(member_counts.count, 0) as member_count,
    COALESCE(user_membership.is_member, false) as is_member
  FROM public.school_conversations c
  LEFT JOIN (
    SELECT conversation_id, COUNT(*) as count
    FROM public.school_conversation_members
    WHERE conversation_id = chat_id
    GROUP BY conversation_id
  ) member_counts ON member_counts.conversation_id = c.id
  LEFT JOIN (
    SELECT conversation_id, true as is_member
    FROM public.school_conversation_members
    WHERE conversation_id = chat_id AND user_id = user_id_param
  ) user_membership ON user_membership.conversation_id = c.id
  WHERE c.id = chat_id;
END;
$$;

-- Function: Join group chat
CREATE OR REPLACE FUNCTION public.join_school_group_chat(conversation_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.school_conversation_members (conversation_id, user_id)
  VALUES (conversation_id_param, user_id_param)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Function: Leave group chat
CREATE OR REPLACE FUNCTION public.leave_school_group_chat(conversation_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.school_conversation_members
  WHERE conversation_id = conversation_id_param AND user_id = user_id_param;
  
  RETURN true;
END;
$$;

-- Function: Start DM or get existing
CREATE OR REPLACE FUNCTION public.start_school_dm_or_get(school_slug_param TEXT, user_a_param UUID, user_b_param UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  conversation_id_var UUID;
  user_a_name TEXT;
  user_b_name TEXT;
BEGIN
  -- Get existing DM conversation
  SELECT c.id INTO conversation_id_var
  FROM public.school_conversations c
  WHERE c.school_slug = school_slug_param 
    AND c.type = 'dm'
    AND EXISTS (
      SELECT 1 FROM public.school_conversation_members cm1 
      WHERE cm1.conversation_id = c.id AND cm1.user_id = user_a_param
    )
    AND EXISTS (
      SELECT 1 FROM public.school_conversation_members cm2 
      WHERE cm2.conversation_id = c.id AND cm2.user_id = user_b_param
    );
  
  -- If not found, create new DM
  IF conversation_id_var IS NULL THEN
    -- Get user names for title
    SELECT display_name INTO user_a_name FROM public.profiles WHERE user_id = user_a_param AND school_slug = school_slug_param;
    SELECT display_name INTO user_b_name FROM public.profiles WHERE user_id = user_b_param AND school_slug = school_slug_param;
    
    -- Create conversation
    INSERT INTO public.school_conversations (school_slug, type, title, created_by)
    VALUES (school_slug_param, 'dm', user_a_name || ' & ' || user_b_name, user_a_param)
    RETURNING id INTO conversation_id_var;
    
    -- Add both users as members
    INSERT INTO public.school_conversation_members (conversation_id, user_id)
    VALUES 
      (conversation_id_var, user_a_param),
      (conversation_id_var, user_b_param);
  END IF;
  
  RETURN conversation_id_var;
END;
$$;

-- Function: Send message
CREATE OR REPLACE FUNCTION public.send_school_message(conversation_id_param UUID, sender_id_param UUID, content_text_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  message_id_var UUID;
BEGIN
  -- Insert message
  INSERT INTO public.school_messages (conversation_id, sender_id, content_text)
  VALUES (conversation_id_param, sender_id_param, content_text_param)
  RETURNING id INTO message_id_var;
  
  -- Update conversation last_message_at
  UPDATE public.school_conversations
  SET last_message_at = now()
  WHERE id = conversation_id_param;
  
  RETURN message_id_var;
END;
$$;

-- Function: List conversations for user
CREATE OR REPLACE FUNCTION public.list_school_conversations(school_slug_param TEXT, user_id_param UUID, limit_count INTEGER DEFAULT 20, cursor_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NULL)
RETURNS TABLE(
  conversation_id UUID,
  title TEXT,
  type TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_text TEXT,
  unread_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    c.title,
    c.type,
    c.last_message_at,
    m.content_text as last_message_text,
    COALESCE(unread.count, 0) as unread_count
  FROM public.school_conversations c
  INNER JOIN public.school_conversation_members cm ON cm.conversation_id = c.id AND cm.user_id = user_id_param
  LEFT JOIN public.school_messages m ON m.conversation_id = c.id AND m.created_at = (
    SELECT MAX(created_at) FROM public.school_messages WHERE conversation_id = c.id
  )
  LEFT JOIN (
    SELECT 
      conversation_id,
      COUNT(*) as count
    FROM public.school_messages msg
    INNER JOIN public.school_conversation_members cm_unread ON cm_unread.conversation_id = msg.conversation_id AND cm_unread.user_id = user_id_param
    WHERE msg.created_at > COALESCE(cm_unread.last_read_at, '1970-01-01'::timestamp)
      AND msg.sender_id != user_id_param
    GROUP BY conversation_id
  ) unread ON unread.conversation_id = c.id
  WHERE c.school_slug = school_slug_param
    AND c.type = 'dm' -- Only DMs in this list (group chat is separate)
    AND (cursor_timestamp IS NULL OR c.last_message_at < cursor_timestamp)
  ORDER BY c.last_message_at DESC
  LIMIT limit_count;
END;
$$;

-- Function: List messages in conversation
CREATE OR REPLACE FUNCTION public.list_school_messages(conversation_id_param UUID, limit_count INTEGER DEFAULT 50, cursor_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NULL)
RETURNS TABLE(
  message_id UUID,
  sender_id UUID,
  sender_name TEXT,
  content_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  reply_to_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id as message_id,
    m.sender_id,
    p.display_name as sender_name,
    m.content_text,
    m.created_at,
    m.reply_to_id
  FROM public.school_messages m
  LEFT JOIN public.profiles p ON p.user_id = m.sender_id
  WHERE m.conversation_id = conversation_id_param
    AND m.deleted_at IS NULL
    AND (cursor_timestamp IS NULL OR m.created_at > cursor_timestamp)
  ORDER BY m.created_at ASC
  LIMIT limit_count;
END;
$$;

-- Function: Mark conversation as read
CREATE OR REPLACE FUNCTION public.mark_school_read(conversation_id_param UUID, user_id_param UUID, message_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  latest_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get timestamp of the message or latest message in conversation
  IF message_id_param IS NOT NULL THEN
    SELECT created_at INTO latest_timestamp FROM public.school_messages WHERE id = message_id_param;
  ELSE
    SELECT MAX(created_at) INTO latest_timestamp FROM public.school_messages WHERE conversation_id = conversation_id_param;
  END IF;
  
  -- Update last_read_at
  UPDATE public.school_conversation_members
  SET last_read_at = COALESCE(latest_timestamp, now())
  WHERE conversation_id = conversation_id_param AND user_id = user_id_param;
  
  RETURN true;
END;
$$;

-- Function: List discover profiles
CREATE OR REPLACE FUNCTION public.list_school_discover_profiles(
  school_slug_param TEXT,
  filters TEXT[] DEFAULT '{}',
  search_query TEXT DEFAULT '',
  limit_count INTEGER DEFAULT 60,
  cursor_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  username TEXT,
  avatar_url TEXT,
  class_year TEXT,
  bio TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.display_name,
    p.username,
    p.avatar_url,
    p.class_year,
    p.bio,
    p.tags,
    p.created_at
  FROM public.profiles p
  WHERE p.school_slug = school_slug_param
    AND p.status = 'active'
    AND p.user_id != auth.uid() -- Don't show own profile
    AND (array_length(filters, 1) IS NULL OR p.tags && filters) -- Filter by tags if provided
    AND (search_query = '' OR (
      p.display_name ILIKE '%' || search_query || '%' OR
      p.username ILIKE '%' || search_query || '%'
    )) -- Search by name/username if provided
    AND (cursor_timestamp IS NULL OR p.created_at < cursor_timestamp)
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Enable realtime for all new tables
ALTER TABLE public.school_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.school_conversation_members REPLICA IDENTITY FULL;  
ALTER TABLE public.school_messages REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;