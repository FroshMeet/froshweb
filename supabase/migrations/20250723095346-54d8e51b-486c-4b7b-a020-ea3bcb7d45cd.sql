-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_or_create_school_chat(school_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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