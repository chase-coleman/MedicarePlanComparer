-- =====================================================
-- v4 (step 2 of 3): backfill plan_group_id
-- =====================================================
-- This is DML, not a schema change. Run it directly against the database
-- (PlanetScale console or `pscale shell`), NOT as a deploy request —
-- deploy requests carry schema only, which is what broke the first attempt.
--
-- Every existing plan becomes its own group. A later 2027 row reuses its
-- 2026 row's plan_group_id to pair them.

UPDATE `plan` SET `plan_group_id` = `id` WHERE `plan_group_id` = 0;

-- Must return 0 before running v4c, or the unique index will be rejected.
SELECT COUNT(*) AS rows_still_unbackfilled FROM `plan` WHERE `plan_group_id` = 0;

-- Must also return 0 — no group may hold two rows for the same year.
SELECT COUNT(*) AS duplicate_group_years FROM (
  SELECT `plan_group_id`, `plan_year`
  FROM `plan`
  GROUP BY `plan_group_id`, `plan_year`
  HAVING COUNT(*) > 1
) d;
