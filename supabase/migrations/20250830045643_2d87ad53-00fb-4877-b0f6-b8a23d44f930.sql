-- Drop existing incompatible tables if they exist
DROP TABLE IF EXISTS public.profile_images CASCADE;
DROP TABLE IF EXISTS public.friend_requests CASCADE;
DROP TABLE IF EXISTS public.friendships CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;

-- Update schools table to match spec
ALTER TABLE public.schools DROP COLUMN IF EXISTS ig_handle;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Update profiles table to match spec exactly
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL,
    username text UNIQUE NOT NULL,
    full_name text NOT NULL,
    class_year int NOT NULL,
    bio text,
    pfp_url text,
    cover_url text,
    school_id uuid NOT NULL REFERENCES public.schools(id),
    is_visible boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create profile_images table
CREATE TABLE public.profile_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    position int DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Create friend_requests table
CREATE TABLE public.friend_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user uuid NOT NULL,
    to_user uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'canceled')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(from_user, to_user)
);

-- Create friendships table
CREATE TABLE public.friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a uuid NOT NULL,
    user_b uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    CHECK (user_a < user_b),
    UNIQUE(user_a, user_b)
);

-- Create messages table
CREATE TABLE public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id uuid NOT NULL,
    sender uuid NOT NULL,
    recipient uuid NOT NULL,
    body text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('covers', 'covers', true),
    ('profile_images', 'profile_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Schools are viewable by everyone" ON public.schools FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Public can view visible profiles" ON public.profiles FOR SELECT USING (is_visible = true);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for profile_images
CREATE POLICY "Public can view images of visible profiles" ON public.profile_images 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = profile_images.profile_id AND p.is_visible = true
    )
);
CREATE POLICY "Users can manage own profile images" ON public.profile_images 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = profile_images.profile_id AND p.user_id = auth.uid()
    )
);

-- RLS Policies for friend_requests
CREATE POLICY "Users can view their friend requests" ON public.friend_requests 
FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user);
CREATE POLICY "Users can send friend requests" ON public.friend_requests 
FOR INSERT WITH CHECK (auth.uid() = from_user AND from_user != to_user);
CREATE POLICY "Users can update friend requests" ON public.friend_requests 
FOR UPDATE USING (
    (auth.uid() = to_user AND status = 'pending') OR 
    (auth.uid() = from_user AND status IN ('pending', 'accepted'))
);

-- RLS Policies for friendships
CREATE POLICY "Users can view their friendships" ON public.friendships 
FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages 
FOR SELECT USING (auth.uid() = sender OR auth.uid() = recipient);
CREATE POLICY "Users can send messages" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for covers
CREATE POLICY "Cover images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Users can upload their own cover" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for profile_images
CREATE POLICY "Profile images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'profile_images');
CREATE POLICY "Users can upload their own profile images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'profile_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed some schools data
INSERT INTO public.schools (slug, name) VALUES 
    ('upenn', 'University of Pennsylvania'),
    ('harvard', 'Harvard University'),
    ('mit', 'MIT'),
    ('stanford', 'Stanford University'),
    ('ucla', 'UCLA'),
    ('berkeley', 'UC Berkeley'),
    ('nyu', 'NYU'),
    ('columbia', 'Columbia University'),
    ('yale', 'Yale University'),
    ('princeton', 'Princeton University')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_visible ON public.profiles(is_visible);
CREATE INDEX idx_profile_images_profile_id ON public.profile_images(profile_id);
CREATE INDEX idx_friend_requests_users ON public.friend_requests(from_user, to_user);
CREATE INDEX idx_friendships_users ON public.friendships(user_a, user_b);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();