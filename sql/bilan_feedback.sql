-- ══════════════════════════════════════════════════════
-- Bilan Nutrition Feedback — Quick feedback after completing the nutrition bilan
-- ══════════════════════════════════════════════════════

create table if not exists bilan_nutrition_feedback (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  -- Was it useful? null = skipped, true = yes, false = no
  useful        boolean,

  -- Free-form comment (optional)
  comment       text,

  created_at    timestamptz not null default now()
);

-- Index for analytics queries
create index if not exists idx_bilan_nutrition_feedback_created
  on bilan_nutrition_feedback(created_at desc);

-- Enable Row Level Security
alter table bilan_nutrition_feedback enable row level security;

-- Users can insert their own feedback
create policy "Users can insert own bilan nutrition feedback"
  on bilan_nutrition_feedback for insert
  with check (auth.uid() = user_id);

-- Service role can read everything (for analytics)
create policy "Service role full access on bilan nutrition feedback"
  on bilan_nutrition_feedback for all
  using (auth.role() = 'service_role');
