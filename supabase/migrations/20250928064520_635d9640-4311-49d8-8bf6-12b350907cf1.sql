-- Fix conflicting RLS policies on waitlist_signups table
-- The issue is multiple conflicting SELECT policies that could cause confusion

-- First, let's see what policies currently exist and clean them up
DO $$ 
BEGIN
    -- Drop all existing SELECT policies to eliminate conflicts
    DROP POLICY IF EXISTS "Authenticated admins only can view waitlist signups" ON public.waitlist_signups;
    DROP POLICY IF EXISTS "Default deny all access to waitlist data" ON public.waitlist_signups;
    DROP POLICY IF EXISTS "Verified admins with backup check can view waitlist signups" ON public.waitlist_signups;
    
    -- Keep the INSERT policy for public waitlist signups (this is correct)
    -- DROP POLICY IF EXISTS "Anyone can create waitlist signup" ON public.waitlist_signups;
    -- We don't drop this one as it allows legitimate waitlist signups
    
    -- Create a single, unambiguous SELECT policy for admins only
    CREATE POLICY "Only verified admins can view waitlist signups" 
    ON public.waitlist_signups 
    FOR SELECT 
    USING (
        -- User must be authenticated
        auth.uid() IS NOT NULL 
        AND 
        -- User must be a verified admin through multiple checks
        public.verify_admin_access(auth.uid())
    );
    
    -- Ensure no UPDATE or DELETE is allowed (waitlist data should be immutable)
    CREATE POLICY "Prevent waitlist updates" 
    ON public.waitlist_signups 
    FOR UPDATE 
    USING (false);
    
    CREATE POLICY "Prevent waitlist deletions" 
    ON public.waitlist_signups 
    FOR DELETE 
    USING (false);
    
END $$;

-- Add additional security constraint to prevent null/empty sensitive data
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT check_email_not_empty 
CHECK (email IS NOT NULL AND email != '');

-- Add constraint to ensure email format is valid (basic check)
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add index for performance on admin queries (admins might search by school)
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_school ON public.waitlist_signups(school);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON public.waitlist_signups(created_at);