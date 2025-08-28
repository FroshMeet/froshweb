-- Create schools table
CREATE TABLE public.schools (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ig_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table (different from user_profiles - scoped by school)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_slug TEXT NOT NULL REFERENCES public.schools(slug) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT,
  avatar_url TEXT,
  class_year TEXT,
  bio TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  UNIQUE(school_slug, username)
);

-- Create school_conversations table (separate from existing conversations)
CREATE TABLE public.school_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_slug TEXT NOT NULL REFERENCES public.schools(slug) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('group', 'dm')),
  title TEXT,
  created_by UUID REFERENCES auth.users(id),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partial unique index for one group chat per school
CREATE UNIQUE INDEX idx_school_conversations_one_group_per_school 
ON public.school_conversations(school_slug) WHERE type = 'group';

-- Create school_conversation_members table
CREATE TABLE public.school_conversation_members (
  conversation_id UUID NOT NULL REFERENCES public.school_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'mod')),
  is_muted BOOLEAN DEFAULT false,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create school_messages table (separate from existing private_messages)
CREATE TABLE public.school_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.school_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_text TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reply_to_id UUID REFERENCES public.school_messages(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_profiles_school_created ON public.profiles(school_slug, created_at DESC);
CREATE INDEX idx_profiles_school_username ON public.profiles(school_slug, username);
CREATE INDEX idx_school_conversations_school_last_message ON public.school_conversations(school_slug, last_message_at DESC);
CREATE INDEX idx_school_messages_conversation_created ON public.school_messages(conversation_id, created_at ASC);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Schools are viewable by everyone" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Only system can manage schools" ON public.schools FOR INSERT WITH CHECK (false);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by same school users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for school_conversations
CREATE POLICY "Users can view school conversations they are members of" ON public.school_conversations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.school_conversation_members cm 
    WHERE cm.conversation_id = school_conversations.id AND cm.user_id = auth.uid()
  ) OR type = 'group' -- Group chat summary visible to all for joining
);

-- RLS Policies for school_conversation_members
CREATE POLICY "Users can view their own school memberships" ON public.school_conversation_members FOR SELECT 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.school_conversations c 
  WHERE c.id = conversation_id AND c.type = 'group'
));
CREATE POLICY "Users can manage their own school memberships" ON public.school_conversation_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own school memberships" ON public.school_conversation_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own school memberships" ON public.school_conversation_members FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for school_messages
CREATE POLICY "Users can view messages in their school conversations" ON public.school_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.school_conversation_members cm 
    WHERE cm.conversation_id = school_messages.conversation_id AND cm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can send messages to their school conversations" ON public.school_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.school_conversation_members cm 
    WHERE cm.conversation_id = school_messages.conversation_id AND cm.user_id = auth.uid()
  )
);

-- Insert default schools
INSERT INTO public.schools (slug, name, ig_handle) VALUES 
('berkeley', 'UC Berkeley', 'ucberkeley'),
('stanford', 'Stanford University', 'stanford'),
('harvard', 'Harvard University', 'harvard'),
('mit', 'MIT', 'mit'),
('ucla', 'UCLA', 'ucla'),
('usc', 'USC', 'usc'),
('columbia', 'Columbia University', 'columbia'),
('nyu', 'NYU', 'nyu'),
('yale', 'Yale University', 'yale'),
('princeton', 'Princeton University', 'princeton'),
('upenn', 'University of Pennsylvania', 'upenn'),
('northwestern', 'Northwestern University', 'northwestern'),
('duke', 'Duke University', 'duke'),
('umich', 'University of Michigan', 'umich')
ON CONFLICT (slug) DO NOTHING;