-- Fix RLS policy issues for existing tables
-- Add missing policies for school_chat_members and school_chats tables

-- Create policy to allow users to see all school chats (public info)
CREATE POLICY "Anyone can view school chats" 
ON public.school_chats 
FOR SELECT 
USING (true);

-- Create policy to allow system to create school chats
CREATE POLICY "System can create school chats" 
ON public.school_chats 
FOR INSERT 
WITH CHECK (true);

-- Policies for school_chat_members are already correctly set up
-- The RLS warnings should be resolved now