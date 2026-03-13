-- Add onboarding metrics used by the app to the profiles table.
-- Safe to run multiple times.

alter table if exists profiles
  add column if not exists age integer,
  add column if not exists height integer,
  add column if not exists weight integer,
  add column if not exists onboarding_data jsonb not null default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;
