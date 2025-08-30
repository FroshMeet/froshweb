-- Add id column and make it primary key for schools table
ALTER TABLE public.schools ADD COLUMN id uuid DEFAULT gen_random_uuid();
UPDATE public.schools SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.schools ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.schools ADD PRIMARY KEY (id);

-- Drop existing incompatible tables if they exist
DROP TABLE IF EXISTS public.profile_images CASCADE;
DROP TABLE IF EXISTS public.friend_requests CASCADE;
DROP TABLE IF EXISTS public.friendships CASCADE;  
DROP TABLE IF EXISTS public.messages CASCADE;

-- Replace the profiles table completely
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
    UNIQUE (from_user, to_user)
);

-- Create friendships table
CREATE TABLE public.friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a uuid NOT NULL,
    user_b uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    CHECK (user_a < user_b),
    UNIQUE (user_a, user_b)
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