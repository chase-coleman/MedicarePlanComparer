-- =====================================================
-- v4: link a plan's rows across years
-- =====================================================
-- Each plan-year is its own row (see v2). These two columns let the app
-- recognise that the 2026 and 2027 rows are the same plan.
--
--   plan_group_id : REQUIRED. The stable identity of a plan across years.
--                   Two rows sharing a plan_group_id are the same plan in
--                   different years. Backfilled below so every existing
--                   plan becomes its own group.
--
--   cms_plan_id   : OPTIONAL. The CMS contract/PBP identifier, e.g.
--                   "H1234-005-000". Nullable because it is not yet known
--                   for these plans. Nothing depends on it; when filled in
--                   it disambiguates plans that share a marketing name
--                   (the two Humana "HumanaChoice" plans in Linn County).

ALTER TABLE `plan`
  ADD COLUMN `plan_group_id` BIGINT NOT NULL DEFAULT 0 AFTER `id`,
  ADD COLUMN `cms_plan_id`   VARCHAR(32) NULL AFTER `plan_name`;

-- Backfill: every existing plan is its own group. When a 2027 row is added
-- for an existing plan, set its plan_group_id to the 2026 row's value.
UPDATE `plan` SET `plan_group_id` = `id` WHERE `plan_group_id` = 0;

CREATE INDEX `idx_plan_plan_group_id` ON `plan` (`plan_group_id`);
CREATE INDEX `idx_plan_cms_plan_id`   ON `plan` (`cms_plan_id`);

-- A plan appears at most once per year within a group.
CREATE UNIQUE INDEX `uk_plan_group_year` ON `plan` (`plan_group_id`, `plan_year`);
