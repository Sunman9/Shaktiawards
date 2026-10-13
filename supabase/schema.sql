-- Run in the Supabase SQL editor. Submissions are write-only to the public
-- application role; reviewers should use the Supabase dashboard with MFA and
-- least-privilege staff accounts. Never expose service_role credentials here.
create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id text not null unique default ('SHA-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 12))),
  type text not null check (type in ('nomination', 'role')),
  payload jsonb not null,
  source text,
  status text not null default 'received' check (status in ('received', 'in_review', 'follow_up', 'closed')),
  created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
-- No public SELECT, UPDATE, or DELETE policies. The Edge Function uses the
-- service role only server-side, after validating and rate-limiting the request.
