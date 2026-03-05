-- Google Calendar MVP storage
-- Run this in Supabase SQL editor.

create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('google')),
  provider_account_email text,
  scope text,
  access_token_encrypted text not null,
  refresh_token_encrypted text not null,
  access_token_expires_at timestamptz,
  status text not null default 'active',
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  last_sync_status text,
  last_sync_error text,
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

create table if not exists public.calendar_freebusy_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('google')),
  busy_slots jsonb not null default '[]'::jsonb,
  window_start timestamptz not null,
  window_end timestamptz not null,
  synced_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

create index if not exists idx_calendar_connections_user on public.calendar_connections(user_id);
create index if not exists idx_calendar_freebusy_user on public.calendar_freebusy_cache(user_id);

alter table public.calendar_connections enable row level security;
alter table public.calendar_freebusy_cache enable row level security;

drop policy if exists "Users read own calendar connections" on public.calendar_connections;
create policy "Users read own calendar connections"
  on public.calendar_connections
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users read own freebusy cache" on public.calendar_freebusy_cache;
create policy "Users read own freebusy cache"
  on public.calendar_freebusy_cache
  for select
  to authenticated
  using (auth.uid() = user_id);
