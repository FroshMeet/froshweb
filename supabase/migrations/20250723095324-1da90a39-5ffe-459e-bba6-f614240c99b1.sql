-- Create school_chats table for exclusive group chats
CREATE TABLE public.school_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_count INTEGER NOT NULL DEFAULT 0
);

-- Create school_chat_members table to track who has joined
CREATE TABLE public.school_chat_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  school_chat_id UUID NOT NULL REFERENCES public.school_chats(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, school_chat_id)
);

-- Create school_chat_messages table for group chat messages
CREATE TABLE public.school_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_chat_id UUID NOT NULL REFERENCES public.school_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table for storing verification status and school info
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  school TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.school_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for school_chats (anyone can view school chats)
CREATE POLICY "Anyone can view school chats" 
ON public.school_chats 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert school chats" 
ON public.school_chats 
FOR INSERT 
WITH CHECK (true);

-- Create policies for school_chat_members (users can only see/join chats for their verified school)
CREATE POLICY "Users can view members of their school chat" 
ON public.school_chat_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    JOIN public.school_chats sc ON sc.id = school_chat_id 
    WHERE up.user_id = auth.uid() 
    AND up.school = sc.school 
    AND up.verified = true
  )
);

CREATE POLICY "Verified users can join their school chat" 
ON public.school_chat_members 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    JOIN public.school_chats sc ON sc.id = school_chat_id 
    WHERE up.user_id = auth.uid() 
    AND up.school = sc.school 
    AND up.verified = true
  )
);

-- Create policies for school_chat_messages (users can only see/send messages for their verified school)
CREATE POLICY "Users can view messages in their school chat" 
ON public.school_chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    JOIN public.school_chats sc ON sc.id = school_chat_id 
    WHERE up.user_id = auth.uid() 
    AND up.school = sc.school 
    AND up.verified = true
  )
);

CREATE POLICY "Verified users can send messages to their school chat" 
ON public.school_chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    JOIN public.school_chats sc ON sc.id = school_chat_id 
    WHERE up.user_id = auth.uid() 
    AND up.school = sc.school 
    AND up.verified = true
  )
);

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_school_chats_updated_at
BEFORE UPDATE ON public.school_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_chat_messages_updated_at
BEFORE UPDATE ON public.school_chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create school chat when first verified user joins
CREATE OR REPLACE FUNCTION public.get_or_create_school_chat(school_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    chat_id UUID;
BEGIN
    -- Try to get existing chat
    SELECT id INTO chat_id FROM public.school_chats WHERE school = school_name;
    
    -- If not found, create it
    IF chat_id IS NULL THEN
        INSERT INTO public.school_chats (school) VALUES (school_name) RETURNING id INTO chat_id;
    END IF;
    
    RETURN chat_id;
END;
$$;