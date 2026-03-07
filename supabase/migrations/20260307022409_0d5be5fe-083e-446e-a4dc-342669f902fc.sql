-- Add name and instagram_post_link columns to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS instagram_post_link text;

-- Make posts viewable by anyone (public student posts)
CREATE POLICY "Anyone can view approved posts"
ON public.posts
FOR SELECT
USING (status = 'pending' OR status = 'approved');