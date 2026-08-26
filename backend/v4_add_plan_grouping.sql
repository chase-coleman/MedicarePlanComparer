-- =====================================================
-- v4 (step 1 of 3): add the grouping columns
-- =====================================================
-- STAGED FOR PLANETSCALE. PlanetScale applies schema changes by copying
-- existing rows into a shadow table; columns added here take their DEFAULT
-- during that copy. Any UNIQUE index on a defaulted column would therefore
-- collide on the second row, so the unique index lives in v4c, after the
-- backfill in v4b.
--
-- Run order:  v4 (deploy)  ->  v4b (DML on the branch)  ->  v4c (deploy)
--
--   plan_group_id : stable identity of a plan across years. Rows sharing it
--                   are the same plan in different years. DEFAULT 0 exists
--                   only so the shadow-table copy succeeds; v4b replaces it.
--   cms_plan_id   : CMS contract/PBP id, e.g. "H1234-005-000". Nullable
--                   until known. Nothing depends on it.

ALTER TABLE `plan`
  ADD COLUMN `plan_group_id` BIGINT NOT NULL DEFAULT 0 AFTER `id`,
  ADD COLUMN `cms_plan_id`   VARCHAR(32) NULL AFTER `plan_name`;

CREATE INDEX `idx_plan_plan_group_id` ON `plan` (`plan_group_id`);
CREATE INDEX `idx_plan_cms_plan_id`   ON `plan` (`cms_plan_id`);
