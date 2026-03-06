-- ══════════════════════════════════════════════════════
-- Bilan Results — Stores completed bilan scores & reports
-- ══════════════════════════════════════════════════════

create table if not exists bilan_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  -- Bilan type: 'nutrition', 'mobilite', 'sommeil', etc.
  bilan_type    text not null,

  -- Raw answers: { "ref-1": 2, "hab-1": 1, ... }
  scores        jsonb not null default '{}'::jsonb,

  -- Computed scores
  global_score  integer not null,          -- percentage 0-100
  global_points integer not null default 0, -- raw points total
  max_points    integer not null default 0, -- max possible points

  -- Sub-scores (nullable — nutrition has digestif/alimentaire)
  sub_scores    jsonb not null default '{}'::jsonb,
  -- e.g. { "digestif": { "score": 22, "max": 30, "pct": 73 }, "alimentaire": { "score": 18, "max": 34, "pct": 53 } }

  -- Per-section breakdown: [{ sectionId, score, max, pct, level, title }]
  section_results jsonb not null default '[]'::jsonb,

  -- Generated report (scientific recommendations, actions, insights)
  report        jsonb not null default '{}'::jsonb,
  -- Structure:
  -- {
  --   "topActions": [...],
  --   "sectionReports": [{ sectionId, level, title, context, recommendation, triggeredInsights, references }],
  --   "globalInsights": [...]
  -- }

  completed_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Index for fast user lookups (most recent first)
create index if not exists idx_bilan_results_user_type 
  on bilan_results(user_id, bilan_type, completed_at desc);

-- Enable Row Level Security
alter table bilan_results enable row level security;

-- Users can read their own results
create policy "Users can read own bilan results"
  on bilan_results for select
  using (auth.uid() = user_id);

-- Users can insert their own results
create policy "Users can insert own bilan results"
  on bilan_results for insert
  with check (auth.uid() = user_id);

-- Service role can do anything (for API routes)
create policy "Service role full access on bilan results"
  on bilan_results for all
  using (auth.role() = 'service_role');
