-- Create hiring_applications table
CREATE TABLE public.hiring_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact info (normalized)
  full_name TEXT NOT NULL,
  instagram_handle TEXT,
  email TEXT,
  
  -- School info (validated against canonical list)
  school_code TEXT NOT NULL,
  school_name TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  
  -- Application details
  time_commitment TEXT NOT NULL,
  why_fit TEXT NOT NULL,
  instagram_familiarity TEXT NOT NULL,
  social_media_experience TEXT NOT NULL,
  social_media_details TEXT,
  
  -- Agreements
  agreement_revenue BOOLEAN NOT NULL DEFAULT false,
  agreement_represent BOOLEAN NOT NULL DEFAULT false,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'accepted', 'archived')),
  
  -- Idempotency and deduplication
  idempotency_key TEXT,
  submission_hash TEXT NOT NULL,
  
  -- Metadata
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.hiring_applications ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no client access)
CREATE POLICY "Service role only access"
ON public.hiring_applications
FOR ALL
USING (false);

-- Create indexes for performance
CREATE INDEX idx_hiring_applications_status ON public.hiring_applications(status);
CREATE INDEX idx_hiring_applications_school_code ON public.hiring_applications(school_code);
CREATE INDEX idx_hiring_applications_created_at ON public.hiring_applications(created_at DESC);
CREATE INDEX idx_hiring_applications_submission_hash ON public.hiring_applications(submission_hash);
CREATE INDEX idx_hiring_applications_idempotency_key ON public.hiring_applications(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Create updated_at trigger
CREATE TRIGGER update_hiring_applications_updated_at
BEFORE UPDATE ON public.hiring_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();