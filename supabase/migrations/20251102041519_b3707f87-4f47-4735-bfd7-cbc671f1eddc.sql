-- Add columns to support Head of Brand applications in hiring_applications table

-- Add application type to distinguish between representative and head of brand
ALTER TABLE public.hiring_applications 
ADD COLUMN IF NOT EXISTS application_type text DEFAULT 'representative' CHECK (application_type IN ('representative', 'head_of_brand'));

-- Make representative-specific fields nullable since head of brand won't use them
ALTER TABLE public.hiring_applications 
ALTER COLUMN time_commitment DROP NOT NULL,
ALTER COLUMN why_fit DROP NOT NULL,
ALTER COLUMN instagram_familiarity DROP NOT NULL,
ALTER COLUMN social_media_experience DROP NOT NULL,
ALTER COLUMN graduation_year DROP NOT NULL,
ALTER COLUMN agreement_revenue DROP NOT NULL,
ALTER COLUMN agreement_represent DROP NOT NULL;

-- Add Head of Brand specific fields
ALTER TABLE public.hiring_applications
ADD COLUMN IF NOT EXISTS portfolio text,
ADD COLUMN IF NOT EXISTS experience text,
ADD COLUMN IF NOT EXISTS viral_idea text,
ADD COLUMN IF NOT EXISTS additional_info text;

-- Add index on application_type for faster queries
CREATE INDEX IF NOT EXISTS idx_hiring_applications_application_type ON public.hiring_applications(application_type);

-- Add comment for clarity
COMMENT ON COLUMN public.hiring_applications.application_type IS 'Type of application: representative or head_of_brand';