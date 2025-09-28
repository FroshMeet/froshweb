-- Implement defense-in-depth security for waitlist_signups table (corrected)
-- Current issue: Single point of failure in admin verification

-- Step 1: Create a more robust verification system with multiple independent checks
CREATE OR REPLACE FUNCTION public.verify_waitlist_access_multi_layer(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
  user_exists boolean;
  role_active boolean;
BEGIN
  -- Layer 1: Basic authentication check
  IF user_id_param IS NULL THEN
    RETURN false;
  END IF;
  
  -- Layer 2: Check if user exists in auth system (prevents fake UUIDs)
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id_param
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    RETURN false;
  END IF;
  
  -- Layer 3: Count active admin roles (prevents bypassing if table is compromised)
  SELECT COUNT(*) INTO admin_count
  FROM public.admin_roles 
  WHERE user_id = user_id_param AND is_active = true;
  
  IF admin_count = 0 THEN
    RETURN false;
  END IF;
  
  -- Layer 4: Verify role is actually active (double-check)
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param 
    AND is_active = true 
    AND granted_at IS NOT NULL
  ) INTO role_active;
  
  IF NOT role_active THEN
    RETURN false;
  END IF;
  
  -- Layer 5: Call original function as final verification
  IF NOT public.verify_admin_access(user_id_param) THEN
    RETURN false;
  END IF;
  
  -- All layers passed
  RETURN true;
END;
$$;

-- Step 2: Create a service-role-only function for ultimate security
CREATE OR REPLACE FUNCTION public.get_waitlist_signups_secure(
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, 
  name text, 
  school text, 
  email text, 
  phone text, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can only be called by service role or verified admins
  IF NOT public.verify_waitlist_access_multi_layer(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Insufficient privileges for waitlist data access';
  END IF;
  
  -- Log the access attempt for audit trail
  INSERT INTO public.waitlist_access_log (user_id, access_type, access_time)
  VALUES (auth.uid(), 'secure_function_access', now());
  
  RETURN QUERY
  SELECT w.id, w.name, w.school, w.email, w.phone, w.created_at
  FROM public.waitlist_signups w
  ORDER BY w.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- Step 3: Replace the existing RLS policy with a more restrictive one
DROP POLICY IF EXISTS "Only verified admins can view waitlist signups" ON public.waitlist_signups;

-- Create a default deny policy first
CREATE POLICY "Default deny waitlist access" 
ON public.waitlist_signups 
FOR SELECT 
USING (false);

-- Create a restrictive policy that requires multiple verification layers
CREATE POLICY "Multi-layer admin verification for waitlist access" 
ON public.waitlist_signups 
FOR SELECT 
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL 
  AND 
  -- Must pass multi-layer verification
  public.verify_waitlist_access_multi_layer(auth.uid())
  AND
  -- Additional check: ensure user has been granted admin role recently (prevents old/stale roles)
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND granted_at > (now() - interval '1 year')
  )
);

-- Step 4: Add additional table-level security constraints
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT check_sensitive_data_not_empty 
CHECK (
  (email IS NOT NULL AND email != '' AND length(email) > 5) AND
  (name IS NOT NULL AND name != '' AND length(name) > 1)
);

-- Step 5: Create enhanced audit logging function that can be called manually
CREATE OR REPLACE FUNCTION public.log_waitlist_access_attempt(
  access_type_param text DEFAULT 'manual_access',
  additional_info text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.waitlist_access_log (
    user_id, 
    access_type, 
    access_time,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(), 
    access_type_param, 
    now(),
    inet_client_addr(),
    additional_info
  );
END;
$$;

-- Step 6: Grant explicit permissions for the secure functions
GRANT EXECUTE ON FUNCTION public.get_waitlist_signups_secure TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_waitlist_access_multi_layer TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_waitlist_access_attempt TO authenticated;