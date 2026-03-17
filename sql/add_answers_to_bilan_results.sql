-- ══════════════════════════════════════════════════════
-- Migration: add answers column to bilan_results
-- Stores per-question individual answers with human-readable labels.
-- Structure: { "questionId": { "value": 2, "label": "Rarement" }, ... }
--
-- Strictly additive — no columns dropped, no types changed, no
-- default values on existing columns altered.
-- ══════════════════════════════════════════════════════

alter table bilan_results
  add column if not exists answers jsonb not null default '{}'::jsonb;

comment on column bilan_results.answers is
  'Per-question individual answers: { "questionId": { "value": <number>, "label": "<selected option text>" } }';
