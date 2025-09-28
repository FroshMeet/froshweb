-- Verify and fix the remaining public data exposure issues
-- The previous migration may not have updated these policies correctly

-- Check if the policies exist and drop/recreate them properly
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Schools are viewable by everyone" ON public.schools;
    DROP POLICY IF EXISTS "Authenticated users can view schools" ON public.schools;
    DROP POLICY IF EXISTS "Anyone can view school Instagram mappings" ON public.school_instagram_usernames;
    DROP POLICY IF EXISTS "Authenticated users can view school Instagram mappings" ON public.school_instagram_usernames;
    
    -- Create new restrictive policies for schools table
    CREATE POLICY "Authenticated users can view schools" 
    ON public.schools 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);
    
    -- Create new restrictive policies for school_instagram_usernames table
    CREATE POLICY "Authenticated users can view school Instagram mappings" 
    ON public.school_instagram_usernames 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);
    
END $$;