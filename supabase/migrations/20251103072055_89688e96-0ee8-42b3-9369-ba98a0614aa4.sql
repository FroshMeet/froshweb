-- Update the referral code generation function to always use FROSH prefix
CREATE OR REPLACE FUNCTION public.gen_ref_code(p_school text)
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
declare
  num text;
  code text;
begin
  -- Generate a truly random 4-digit number (1000-9999)
  num := lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
  code := 'FROSH-' || num;
  return code;
end$function$;