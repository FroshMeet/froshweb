-- Fix search_path for gen_ref_code function
create or replace function gen_ref_code(p_school text)
returns text
language plpgsql
set search_path = public
as $$
declare
  prefix text := coalesce(nullif(regexp_replace(upper(p_school), '[^A-Z]', '', 'g'), ''), 'SCH');
  num text;
  code text;
begin
  num := lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
  code := substr(prefix, 1, 4) || '-' || num;
  return code;
end$$;