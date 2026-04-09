create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  display_name text not null,
  invite_code text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invites (
  code text primary key,
  email text not null unique,
  status text not null check (status in ('pending', 'accepted', 'revoked')),
  invited_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_quotas (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  managed_credits integer not null default 0,
  daily_cap integer not null default 0,
  used_today integer not null default 0,
  byok_enabled boolean not null default false
);

create table if not exists public.competitions (
  slug text primary key,
  name text not null,
  season_label text not null,
  country text not null
);

create table if not exists public.teams (
  id text primary key,
  name text not null,
  short_name text not null,
  city text not null
);

create table if not exists public.fixtures (
  id text primary key,
  competition_slug text not null references public.competitions(slug),
  kickoff_at timestamptz not null,
  round_label text not null,
  venue text not null,
  headline text not null,
  signal_tag text not null,
  status text not null check (status in ('scheduled', 'finished')),
  home_team_id text not null references public.teams(id),
  away_team_id text not null references public.teams(id)
);

create table if not exists public.fixture_snapshots (
  id uuid primary key default gen_random_uuid(),
  fixture_id text not null references public.fixtures(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  fixture_id text not null references public.fixtures(id) on delete cascade,
  requested_providers text[] not null default '{}',
  engine_payload jsonb not null,
  consensus_payload jsonb not null,
  generated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.provider_outputs (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs(id) on delete cascade,
  provider text not null,
  payload jsonb not null,
  latency_ms integer not null default 0,
  execution_mode text not null default 'managed'
);

create table if not exists public.provider_scores (
  provider text primary key,
  accuracy numeric not null default 0,
  calibration numeric not null default 0,
  greens integer not null default 0,
  reds integer not null default 0,
  resolved_samples integer not null default 0,
  trend text not null default 'steady'
);

create table if not exists public.user_provider_keys (
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  encrypted_key text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, provider)
);
