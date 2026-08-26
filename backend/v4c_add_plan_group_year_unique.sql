-- =====================================================
-- v4 (step 3 of 3): enforce one row per plan per year
-- =====================================================
-- Deploy this only after v4b reports 0 for both checks. The shadow-table
-- copy now sees real plan_group_id values, so the index builds cleanly.

CREATE UNIQUE INDEX `uk_plan_group_year` ON `plan` (`plan_group_id`, `plan_year`);

-- The DEFAULT 0 was scaffolding for the v4 copy. Drop it so new rows must
-- state their group explicitly rather than silently landing in group 0.
ALTER TABLE `plan` ALTER COLUMN `plan_group_id` DROP DEFAULT;
