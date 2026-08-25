-- =====================================================
-- v2: add plan_year to `plan`
-- =====================================================
-- Run once against an existing database. v1_init.sql already carries this
-- column for fresh installs, so this file is only for databases created
-- before plan_year existed.
--
-- The DEFAULT backfills every existing row to 2026, which is what all
-- current plans are. New rows should set plan_year explicitly.

ALTER TABLE `plan`
  ADD COLUMN `plan_year` INT NOT NULL DEFAULT 2026 AFTER `plan_name`;

-- Plans are looked up by company and county, then shown per year. Once
-- 2027 rows land, most reads will filter on plan_year.
CREATE INDEX `idx_plan_plan_year` ON `plan` (`plan_year`);
