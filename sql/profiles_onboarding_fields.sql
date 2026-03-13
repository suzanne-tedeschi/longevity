-- Add individual onboarding columns to the profiles table.
-- Safe to run multiple times.

alter table if exists profiles
  add column if not exists age integer,
  add column if not exists height integer,
  add column if not exists weight integer,
  add column if not exists activity_frequency text,
  add column if not exists weekly_activities text[],
  add column if not exists agenda_activities text,
  add column if not exists agenda_mode text,
  add column if not exists agenda_sessions jsonb,
  add column if not exists google_calendar_wanted boolean,
  add column if not exists google_calendar_connected boolean,
  add column if not exists limitations text[],
  add column if not exists joint_pain_where text,
  add column if not exists muscle_pain_where text,
  add column if not exists other_limitation text,
  add column if not exists evo_usage text,
  add column if not exists priorities text[],
  add column if not exists diet text,
  add column if not exists other_diet text,
  add column if not exists coach_tone text,
  add column if not exists expectations text,
  add column if not exists onboarding_completed_at timestamptz;

-- Drop the old JSONB blob if it exists
alter table if exists profiles
  drop column if exists onboarding_data;
