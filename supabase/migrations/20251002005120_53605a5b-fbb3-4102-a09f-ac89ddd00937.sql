-- Fix Security Definer View Issue
-- The safe_profiles view is flagged as a security risk
-- Remove it since RLS policies already handle data filtering properly

DROP VIEW IF EXISTS public.safe_profiles;