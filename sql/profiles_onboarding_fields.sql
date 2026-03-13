-- Add all onboarding questionnaire fields to profiles table.
-- Safe to run multiple times.

alter table if exists profiles
  add column if not exists first_name text default '',
  add column if not exists age integer,
  add column if not exists height integer,
  add column if not exists weight integer,
  add column if not exists activity_frequency text default '',
  add column if not exists weekly_activities text[] default '{}',
  add column if not exists agenda_sessions jsonb default '[]'::jsonb,
  add column if not exists agenda_mode text default '',
  add column if not exists google_calendar_wanted boolean,
  add column if not exists google_calendar_connected boolean default false,
  add column if not exists limitations text[] default '{}',
  add column if not exists joint_pain_where text default '',
  add column if not exists muscle_pain_where text default '',
  add column if not exists other_limitation text default '',
  add column if not exists evo_usage text default '',
  add column if not exists priorities text[] default '{}',
  add column if not exists diet text default '',
  add column if not exists other_diet text default '',
  add column if not exists coach_tone text default '',
  add column if not exists expectations text default '',
  add column if not exists onboarding_data jsonb default '{}'::jsonb,
  add column if not exists onboarding_completed_at timestamptz;

-- Drop the old JSONB blob if it exists
alter table if exists profiles
  drop column if exists onboarding_data;
