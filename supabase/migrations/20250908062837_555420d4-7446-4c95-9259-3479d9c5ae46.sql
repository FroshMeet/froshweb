-- Create table to store Instagram username mappings for schools
CREATE TABLE IF NOT EXISTS public.school_instagram_usernames (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_slug TEXT NOT NULL UNIQUE,
  instagram_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_instagram_usernames ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no auth needed for viewing Instagram info)
CREATE POLICY "Anyone can view school Instagram mappings" 
ON public.school_instagram_usernames 
FOR SELECT 
USING (true);

-- Insert the school mappings
INSERT INTO public.school_instagram_usernames (school_slug, instagram_username) VALUES
  ('harvard', 'harvard2030class'),
  ('upenn', 'upenn2030class'),
  ('princeton', 'princeton2030class'),
  ('columbia', 'columbia2030meet'),
  ('yale', 'yale2030class'),
  ('cornell', 'cornell2030meet'),
  ('dartmouth', 'dartmouth2030'),
  ('brown', 'brown2030meet'),
  ('ucsc', 'ucsc2030class'),
  ('berkeley', 'berkeley2030meet'),
  ('ucsd', 'ucsd2030meet'),
  ('uci', 'uci2030meet'),
  ('ucdavis', 'ucdavis2030meet'),
  ('ucsb', 'ucsb2030class'),
  ('ucmerced', 'ucmerced2030'),
  ('ucr', 'ucr2030meet'),
  ('ucla', 'ucla2030meet'),
  ('stanford', 'stanford2030class'),
  ('caltech', 'caltech2030'),
  ('usc', 'usc2030meet'),
  ('sfsu', 'sfsu2030class'),
  ('csulb', 'csulb2030class'),
  ('cpp', 'cpp2030class'),
  ('sdsu', 'sdsu2030.fm'),
  ('sjsu', 'sjsu2030meet'),
  ('csuchico', 'csuchico2030'),
  ('calpolyslo', 'calpolyslo2030meet'),
  ('csuf', 'csuf2030class'),
  ('lmu', 'lmu2030meet'),
  ('sierra', 'sierra2030class'),
  ('flc', 'flc2030'),
  ('arc', 'arc2030class'),
  ('jessup', 'jessup2030'),
  ('sacstate', 'sacstate2030'),
  ('modesto', 'modesto2030class'),
  ('yuba', 'yuba2030class'),
  ('uop', 'uop2030meet'),
  ('sacramento', 'sacramento2030class'),
  ('laketahoe', 'laketahoe2030'),
  ('nyu', 'nyu2030meet'),
  ('fsu', 'fsu2030meet'),
  ('mit', 'mit2030class'),
  ('duke', 'duke2030meet'),
  ('usf', 'usf2030class'),
  ('unc', 'unc2030fm'),
  ('uva', 'uva2030meet'),
  ('northwestern', 'northwestern2030'),
  ('vanderbilt', 'vanderbilt2030'),
  ('georgetown', 'georgetown2030meet'),
  ('bu', 'bu2030meet'),
  ('miami', 'miami2030meet'),
  ('psu', 'psu2030students'),
  ('uoft', 'uoft2030class'),
  ('uconn', 'uconn2030meet'),
  ('northeastern', 'northeastern2030meet'),
  ('uga', 'uga2030meet'),
  ('ualabama', 'ualabama2030'),
  ('uchicago', 'uchicago2030'),
  ('mich', 'mich2030class'),
  ('umn', 'umn2030students'),
  ('cincy', 'cincy2030fm'),
  ('uiowa', 'uiowa2030class'),
  ('cuboulder', 'cuboulder2030class'),
  ('uwm', 'uwm2030class'),
  ('uiuc', 'uiuc2030co'),
  ('purdue', 'purdue2030meet'),
  ('msu', 'msu2030meet'),
  ('osu', 'osu2030class'),
  ('ou', 'ou2030meet'),
  ('cmu', 'cmu2030meet'),
  ('iub', 'iub2030'),
  ('asu', 'asu2030meet'),
  ('utaustin', 'utaustin2030meet'),
  ('uwash', 'uwash2030'),
  ('rice', 'rice2030meet'),
  ('uarizona', 'uarizona2030meet'),
  ('tamu', 'tamu2030meet'),
  ('oregon', 'oregon2030class'),
  ('ucf', 'ucf2030students'),
  ('olemiss', 'olemiss2030meet'),
  ('boisestate', 'boisestate2030class'),
  ('utah', 'utah2030class'),
  ('utk', 'utk2030students'),
  ('arkansas', 'arkansas2030class'),
  ('vt', 'vt2030meet'),
  ('lsu', 'lsu2030co'),
  ('rutgers', 'rutgers2030class'),
  ('clemson', 'clemson2030students'),
  ('auburn', 'auburn2030students'),
  ('uofsc', 'uofsc2030meet'),
  ('ttu', 'ttu2030students'),
  ('ukentucky', 'ukentucky2030'),
  ('mizzou', 'mizzou2030students'),
  ('unlincoln', 'unlincoln2030'),
  ('pitt', 'pitt2030students'),
  ('kansas', 'kansas2030meet'),
  ('jhu', 'jhu2030class'),
  ('wfu', 'wfu2030class'),
  ('tufts', 'tufts2030meet'),
  ('emory', 'emory2030class');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_school_instagram_usernames_updated_at
BEFORE UPDATE ON public.school_instagram_usernames
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();