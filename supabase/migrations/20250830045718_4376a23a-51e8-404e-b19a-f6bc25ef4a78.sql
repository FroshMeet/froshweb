-- First, check and update the schools table structure properly
-- The schools table already exists, so let's work with what we have

-- Add missing columns to schools if they don't exist
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- If schools doesn't have a proper primary key on id, we need to fix this carefully
-- First check if the slug is the current primary key and update accordingly
DO $$
BEGIN
    -- If there's no primary key constraint on id, create it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%_pkey' 
        AND table_name = 'schools' 
        AND constraint_type = 'PRIMARY KEY'
        AND EXISTS (
            SELECT 1 FROM information_schema.constraint_column_usage 
            WHERE table_name = 'schools' AND column_name = 'id'
            AND constraint_name = constraint_name
        )
    ) THEN
        -- Drop the existing primary key if it exists on slug
        BEGIN
            ALTER TABLE public.schools DROP CONSTRAINT IF EXISTS schools_pkey;
            -- Add proper primary key on id
            ALTER TABLE public.schools ADD PRIMARY KEY (id);
        EXCEPTION WHEN OTHERS THEN
            -- If that fails, just make sure we have unique constraint on slug
            ALTER TABLE public.schools ADD CONSTRAINT schools_slug_unique UNIQUE (slug);
        END;
    END IF;
END $$;

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
    created_at timestamptz DEFAULT now()
);

-- Add unique constraint to prevent duplicate friend requests
ALTER TABLE public.friend_requests ADD CONSTRAINT unique_friend_request UNIQUE (from_user, to_user);

-- Create friendships table
CREATE TABLE public.friendships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a uuid NOT NULL,
    user_b uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    CHECK (user_a < user_b)
);

-- Add unique constraint for friendships
ALTER TABLE public.friendships ADD CONSTRAINT unique_friendship UNIQUE (user_a, user_b);

-- Create messages table
CREATE TABLE public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id uuid NOT NULL,
    sender uuid NOT NULL,
    recipient uuid NOT NULL,
    body text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;