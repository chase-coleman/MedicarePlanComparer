-- =====================================================
-- v5: mark plan-years whose benefits are not yet published
-- =====================================================
-- 2027 rows exist so the year toggle has something to switch to, but CMS
-- benefit data for 2027 is not available yet. Rather than make all 18
-- benefit columns nullable (which would let real data go null by accident),
-- one flag says "this row is a placeholder" and the UI renders every
-- benefit as N/A.
--
-- Safe as a single PlanetScale deploy: no unique index is involved, and
-- DEFAULT TRUE already gives every copied row the right value, so no
-- backfill UPDATE is needed.
--
-- Flip a row to TRUE once its real figures are entered.

ALTER TABLE `plan`
  ADD COLUMN `benefits_published` BOOLEAN NOT NULL DEFAULT TRUE AFTER `plan_year`;
