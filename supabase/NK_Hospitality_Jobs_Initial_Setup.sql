-- N K Hospitality Jobs — Supabase foundation
-- Run once in a NEW Supabase project's SQL Editor.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin','hotelier','job_seeker');
create type public.review_status as enum ('draft','pending_ai_check','pending_admin_review','changes_requested','approved','rejected','suspended','expired');
create type public.payment_status as enum ('not_required','payment_required','verification_pending','confirmed','rejected','refunded');
create type public.application_status as enum ('submitted','viewed','shortlisted','interview','offered','hired','rejected','withdrawn');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  phone text,
  avatar_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  name text not null,
  slug text unique,
  registration_number text,
  property_type text,
  address text,
  district text,
  email text,
  phone text,
  logo_path text,
  website text,
  verification_status public.review_status not null default 'pending_admin_review',
  free_job_post_used boolean not null default false,
  free_job_post_used_at timestamptz,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hotel_members (
  hotel_id uuid references public.hotels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  member_role text not null check (member_role in ('owner','recruitment_manager','team_member')),
  primary key (hotel_id,user_id)
);

create table public.candidate_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  professional_summary text,
  district text,
  preferred_districts text[] default '{}',
  willing_to_relocate boolean not null default false,
  expected_salary_min integer,
  expected_salary_max integer,
  available_from date,
  current_employer text,
  hide_current_employer boolean not null default false,
  discoverable boolean not null default true,
  years_experience numeric(4,1) default 0,
  profile_strength integer not null default 0 check (profile_strength between 0 and 100),
  review_status public.review_status not null default 'draft',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_documents (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  document_type text not null default 'cv' check (document_type in ('cv','certificate','reference','identity')),
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  file_size integer not null,
  ai_extracted_json jsonb,
  ai_flags jsonb default '[]',
  review_status public.review_status not null default 'pending_ai_check',
  is_current boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.candidate_experience (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  employer text not null,
  job_title text not null,
  department text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  display_order integer not null default 0
);

create table public.candidate_education (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  institution text not null,
  qualification text not null,
  field_of_study text,
  completed_year integer,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','document_reviewed','verified'))
);

create table public.skills (
  id bigint generated always as identity primary key,
  name text not null unique,
  category text,
  active boolean not null default true
);

create table public.candidate_skills (
  candidate_id uuid references public.candidate_profiles(user_id) on delete cascade,
  skill_id bigint references public.skills(id) on delete cascade,
  proficiency text check (proficiency in ('basic','intermediate','advanced','expert')),
  years_experience numeric(4,1),
  primary key (candidate_id,skill_id)
);

create table public.job_posts (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  reference_code text unique,
  title text not null,
  department text not null,
  description text not null,
  employment_type text not null,
  district text not null,
  address text,
  salary_min integer,
  salary_max integer,
  salary_visible boolean not null default true,
  accommodation_available boolean not null default false,
  meals_available boolean not null default false,
  vacancies integer not null default 1 check (vacancies > 0),
  minimum_experience numeric(4,1) default 0,
  minimum_qualification text,
  required_languages text[] default '{}',
  start_date date,
  closes_at timestamptz,
  review_status public.review_status not null default 'draft',
  payment_status public.payment_status not null default 'not_required',
  price_lkr integer not null default 0,
  is_free_post boolean not null default false,
  ai_review_json jsonb,
  published_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_skills (
  job_id uuid references public.job_posts(id) on delete cascade,
  skill_id bigint references public.skills(id) on delete cascade,
  is_mandatory boolean not null default false,
  minimum_proficiency text check (minimum_proficiency in ('basic','intermediate','advanced','expert')),
  primary key (job_id,skill_id)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_posts(id) on delete cascade,
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  status public.application_status not null default 'submitted',
  cover_note text,
  match_score integer check (match_score between 0 and 100),
  match_explanation jsonb,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id,candidate_id)
);

create table public.ai_matches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_posts(id) on delete cascade,
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  score integer not null check (score between 0 and 100),
  mandatory_requirements_met boolean not null,
  factor_scores jsonb not null,
  explanation jsonb not null,
  model_version text,
  generated_at timestamptz not null default now(),
  unique(job_id,candidate_id)
);

create table public.saved_jobs (
  candidate_id uuid references public.candidate_profiles(user_id) on delete cascade,
  job_id uuid references public.job_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(candidate_id,job_id)
);

create table public.candidate_unlocks (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  candidate_id uuid not null references public.candidate_profiles(user_id) on delete cascade,
  job_id uuid references public.job_posts(id) on delete set null,
  unlocked_by uuid not null references public.profiles(id),
  unlocked_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  job_id uuid references public.job_posts(id) on delete set null,
  reference_code text not null unique,
  amount_lkr integer not null check (amount_lkr > 0),
  status public.payment_status not null default 'payment_required',
  receipt_path text,
  whatsapp_requested_at timestamptz,
  payer_note text,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  rejection_reason text,
  created_at timestamptz not null default now()
);

create table public.admin_reviews (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('hotel','candidate','document','job','payment')),
  entity_id uuid not null,
  reviewer_id uuid not null references public.profiles(id),
  decision text not null check (decision in ('approved','changes_requested','rejected','suspended','confirmed')),
  notes text,
  ai_summary jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index job_posts_discovery_idx on public.job_posts(review_status,district,department,published_at desc);
create index candidate_discovery_idx on public.candidate_profiles(review_status,discoverable,district);
create index applications_job_idx on public.applications(job_id,status,applied_at desc);
create index matches_job_score_idx on public.ai_matches(job_id,score desc);
create index reviews_entity_idx on public.admin_reviews(entity_type,entity_id,created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,role,full_name,phone)
  values(new.id,coalesce((new.raw_user_meta_data->>'role')::public.user_role,'job_seeker'),coalesce(new.raw_user_meta_data->>'full_name','New user'),new.raw_user_meta_data->>'phone');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.prepare_job_price() returns trigger language plpgsql security definer set search_path=public as $$
declare already_used boolean;
begin
  select free_job_post_used into already_used from public.hotels where id=new.hotel_id for update;
  if not already_used then
    new.is_free_post:=true; new.price_lkr:=0; new.payment_status:='not_required';
  else
    new.is_free_post:=false; new.price_lkr:=1000; new.payment_status:='payment_required';
  end if;
  new.reference_code:=coalesce(new.reference_code,'JOB-'||to_char(now(),'YYYY')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)));
  return new;
end; $$;
create trigger set_job_price before insert on public.job_posts for each row execute function public.prepare_job_price();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin' and is_active=true);
$$;
create or replace function public.is_hotel_member(target_hotel uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.hotel_members where hotel_id=target_hotel and user_id=auth.uid()) or exists(select 1 from public.hotels where id=target_hotel and owner_id=auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.hotels enable row level security;
alter table public.hotel_members enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.candidate_documents enable row level security;
alter table public.candidate_experience enable row level security;
alter table public.candidate_education enable row level security;
alter table public.skills enable row level security;
alter table public.candidate_skills enable row level security;
alter table public.job_posts enable row level security;
alter table public.job_skills enable row level security;
alter table public.applications enable row level security;
alter table public.ai_matches enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.candidate_unlocks enable row level security;
alter table public.payments enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "own profile or admin" on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy "update own profile" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "public approved hotels" on public.hotels for select using(verification_status='approved' or public.is_hotel_member(id) or public.is_admin());
create policy "hotelier creates hotel" on public.hotels for insert with check(owner_id=auth.uid());
create policy "members update hotel" on public.hotels for update using(public.is_hotel_member(id) or public.is_admin());
create policy "members read membership" on public.hotel_members for select using(user_id=auth.uid() or public.is_hotel_member(hotel_id) or public.is_admin());
create policy "owner creates membership" on public.hotel_members for insert with check(user_id=auth.uid() and exists(select 1 from public.hotels h where h.id=hotel_id and h.owner_id=auth.uid()));
create policy "candidate reads profile" on public.candidate_profiles for select using(user_id=auth.uid() or public.is_admin() or (review_status='approved' and discoverable));
create policy "candidate manages profile" on public.candidate_profiles for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "candidate manages documents" on public.candidate_documents for all using(candidate_id=auth.uid() or public.is_admin()) with check(candidate_id=auth.uid() or public.is_admin());
create policy "candidate manages experience" on public.candidate_experience for all using(candidate_id=auth.uid() or public.is_admin()) with check(candidate_id=auth.uid() or public.is_admin());
create policy "candidate manages education" on public.candidate_education for all using(candidate_id=auth.uid() or public.is_admin()) with check(candidate_id=auth.uid() or public.is_admin());
create policy "skills readable" on public.skills for select using(true);
create policy "admin manages skills" on public.skills for all using(public.is_admin()) with check(public.is_admin());
create policy "candidate manages skills" on public.candidate_skills for all using(candidate_id=auth.uid() or public.is_admin()) with check(candidate_id=auth.uid() or public.is_admin());
create policy "published jobs readable" on public.job_posts for select using(review_status='approved' or public.is_hotel_member(hotel_id) or public.is_admin());
create policy "hotel creates jobs" on public.job_posts for insert with check(public.is_hotel_member(hotel_id));
create policy "hotel updates jobs" on public.job_posts for update using(public.is_hotel_member(hotel_id) or public.is_admin());
create policy "job skills readable" on public.job_skills for select using(true);
create policy "hotel manages job skills" on public.job_skills for all using(exists(select 1 from public.job_posts j where j.id=job_id and public.is_hotel_member(j.hotel_id)) or public.is_admin());
create policy "application parties read" on public.applications for select using(candidate_id=auth.uid() or exists(select 1 from public.job_posts j where j.id=job_id and public.is_hotel_member(j.hotel_id)) or public.is_admin());
create policy "candidate applies" on public.applications for insert with check(candidate_id=auth.uid());
create policy "application parties update" on public.applications for update using(candidate_id=auth.uid() or exists(select 1 from public.job_posts j where j.id=job_id and public.is_hotel_member(j.hotel_id)) or public.is_admin());
create policy "match parties read" on public.ai_matches for select using(candidate_id=auth.uid() or exists(select 1 from public.job_posts j where j.id=job_id and public.is_hotel_member(j.hotel_id)) or public.is_admin());
create policy "candidate saves jobs" on public.saved_jobs for all using(candidate_id=auth.uid()) with check(candidate_id=auth.uid());
create policy "hotels read own unlocks" on public.candidate_unlocks for select using(public.is_hotel_member(hotel_id) or candidate_id=auth.uid() or public.is_admin());
create policy "hotel creates unlock" on public.candidate_unlocks for insert with check(public.is_hotel_member(hotel_id));
create policy "hotel payment access" on public.payments for select using(public.is_hotel_member(hotel_id) or public.is_admin());
create policy "hotel creates payment" on public.payments for insert with check(public.is_hotel_member(hotel_id));
create policy "admin updates payment" on public.payments for update using(public.is_admin());
create policy "admin reviews only" on public.admin_reviews for all using(public.is_admin()) with check(public.is_admin());
create policy "own notifications" on public.notifications for select using(user_id=auth.uid() or public.is_admin());
create policy "own notifications update" on public.notifications for update using(user_id=auth.uid());
create policy "admin audit logs" on public.audit_logs for select using(public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('candidate-cvs','candidate-cvs',false,5242880,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
('payment-receipts','payment-receipts',false,5242880,array['image/jpeg','image/png','application/pdf']),
('profile-assets','profile-assets',false,3145728,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;

create policy "candidate uploads own CV" on storage.objects for insert to authenticated with check(bucket_id='candidate-cvs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "candidate reads own CV" on storage.objects for select to authenticated using(bucket_id='candidate-cvs' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
create policy "candidate replaces own CV" on storage.objects for update to authenticated using(bucket_id='candidate-cvs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "authenticated uploads receipt" on storage.objects for insert to authenticated with check(bucket_id='payment-receipts');
create policy "admin reads receipts" on storage.objects for select to authenticated using(bucket_id='payment-receipts' and public.is_admin());

insert into public.skills(name,category) values
('Opera PMS','Hotel systems'),('Cloudbeds','Hotel systems'),('Front office','Operations'),('Guest relations','Operations'),('Reservations','Reservations'),('OTA management','Reservations'),('Revenue management','Commercial'),('Food preparation','Kitchen'),('Food safety','Kitchen'),('Housekeeping','Operations'),('English','Languages'),('Sinhala','Languages'),('Tamil','Languages')
on conflict(name) do nothing;
