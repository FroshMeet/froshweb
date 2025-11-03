-- Enable pgcrypto extension for random UUID generation
create extension if not exists pgcrypto;

-- Referrers who generate codes
create table if not exists referrers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school text,
  email text unique not null,
  code text unique not null,
  created_at timestamptz default now(),
  last_issued_at timestamptz
);

-- Representative applications
create table if not exists rep_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school text not null,
  email text not null,
  socials jsonb,
  created_at timestamptz default now()
);

-- Referral link between a referrer and an application
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references referrers(id) on delete cascade,
  application_id uuid references rep_applications(id) on delete cascade,
  status text check (status in ('pending','confirmed','hired','earning','rejected')) default 'pending',
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- Optional future revenue attachment per school
create table if not exists school_accounts (
  id uuid primary key default gen_random_uuid(),
  school text unique not null,
  rep_application_id uuid references rep_applications(id),
  revenue_cents bigint default 0,
  created_at timestamptz default now()
);

-- Indexes
create unique index if not exists idx_referrers_email on referrers (email);
create unique index if not exists idx_referrers_code on referrers (code);
create index if not exists idx_referrals_referrer on referrals (referrer_id);
create index if not exists idx_referrals_application on referrals (application_id);

-- Row level security
alter table referrers enable row level security;
alter table rep_applications enable row level security;
alter table referrals enable row level security;
alter table school_accounts enable row level security;

-- Policies deny all by default. RPCs will run with security definer.
create policy deny_all_referrers on referrers for all using (false) with check (false);
create policy deny_all_applications on rep_applications for all using (false) with check (false);
create policy deny_all_referrals on referrals for all using (false) with check (false);
create policy deny_all_school_accounts on school_accounts for all using (false) with check (false);

-- Generate an uppercase code like UCSC-1234 from school and a random 4 digits
create or replace function gen_ref_code(p_school text)
returns text
language plpgsql
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

-- Issue a referral code if the email does not already have one
create or replace function issue_referral_code(p_name text, p_school text, p_email text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  r referrers;
  existing referrers;
  new_code text;
begin
  select * into existing from referrers where email = lower(p_email);
  if existing.id is not null then
    return row_to_json(existing);
  end if;

  loop
    new_code := gen_ref_code(p_school);
    begin
      insert into referrers(name, school, email, code, last_issued_at)
      values (p_name, p_school, lower(p_email), new_code, now())
      returning * into r;
      exit;
    exception when unique_violation then
      -- regenerate on rare collision
    end;
  end loop;

  return row_to_json(r);
end$$;

-- Submit an application and attach a referral if the code is valid
create or replace function submit_rep_application(
  p_name text,
  p_school text,
  p_email text,
  p_socials jsonb,
  p_ref_code text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  app rep_applications;
  r referrers;
  ref_id uuid;
begin
  insert into rep_applications(name, school, email, socials)
  values (p_name, p_school, lower(p_email), p_socials)
  returning * into app;

  if p_ref_code is not null and length(trim(p_ref_code)) > 0 then
    select * into r from referrers where code = trim(upper(p_ref_code));
    if r.id is null then
      raise exception 'Invalid referral code';
    end if;

    if lower(r.email) = lower(p_email) then
      raise exception 'Self referrals are not allowed';
    end if;

    insert into referrals(referrer_id, application_id, status)
    values (r.id, app.id, 'pending')
    returning id into ref_id;
    
    return json_build_object(
      'application', row_to_json(app),
      'referral_id', ref_id,
      'referrer_email', r.email,
      'referrer_name', r.name
    );
  end if;

  return json_build_object('application', row_to_json(app));
end$$;

-- Confirm referral by id
create or replace function confirm_referral(p_referral_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update referrals
  set status = 'confirmed', confirmed_at = now()
  where id = p_referral_id and status = 'pending';
$$;

-- Update referral status (for admin)
create or replace function update_referral_status(p_referral_id uuid, p_status text)
returns void
language sql
security definer
set search_path = public
as $$
  update referrals
  set status = p_status
  where id = p_referral_id and p_status in ('pending','confirmed','hired','earning','rejected');
$$;

-- Get applications with referral info for admin
create or replace function get_applications_with_referrals()
returns table(
  app_id uuid,
  app_name text,
  app_school text,
  app_email text,
  app_created_at timestamptz,
  referral_code text,
  referrer_email text,
  referral_status text
)
language sql
security definer
set search_path = public
as $$
  select 
    a.id,
    a.name,
    a.school,
    a.email,
    a.created_at,
    r.code,
    r.email,
    ref.status
  from rep_applications a
  left join referrals ref on ref.application_id = a.id
  left join referrers r on r.id = ref.referrer_id
  order by a.created_at desc;
$$;

-- Get all referrals for admin
create or replace function get_all_referrals()
returns table(
  referral_id uuid,
  referrer_email text,
  referrer_name text,
  applicant_email text,
  applicant_name text,
  status text,
  confirmed_at timestamptz,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select 
    ref.id,
    r.email,
    r.name,
    a.email,
    a.name,
    ref.status,
    ref.confirmed_at,
    ref.created_at
  from referrals ref
  join referrers r on r.id = ref.referrer_id
  join rep_applications a on a.id = ref.application_id
  order by ref.created_at desc;
$$;