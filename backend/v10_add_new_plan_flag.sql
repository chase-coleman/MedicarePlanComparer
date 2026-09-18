-- =====================================================
-- v10: mark plans as newly offered
-- =====================================================
-- SPLIT RUN. Section 1 is a schema change and goes in a PlanetScale deploy
-- request. Sections 2 and 3 are DML and run directly against the database
-- (console or `pscale shell`) -- a deploy request silently drops them.
--
-- One flag says "this plan is new," and the client renders a "New plan!"
-- badge straddling the top edge of the plan card. It is per plan-year row,
-- not per plan group, so a plan can be flagged new in the year it launches
-- and unflagged the following year without touching the other year's row.
--
-- DEFAULT FALSE is what makes section 1 safe as a single deploy: PlanetScale
-- applies schema changes by copying rows into a shadow table, and a column
-- added in that same change takes its DEFAULT for every copied row. So every
-- existing plan lands unflagged with no backfill needed, and no UNIQUE index
-- is involved to collide (contrast v4, which had to be split three ways).
--
-- The PlanetScale console runs ONE statement at a time. Every statement
-- below is a single line: paste and run them one at a time, in order.

-- =====================================================
-- 1. Schema -- deploy request
-- =====================================================
ALTER TABLE `plan` ADD COLUMN `new_plan` BOOLEAN NOT NULL DEFAULT FALSE AFTER `benefits_published`;

-- =====================================================
-- 2. Clear the flag on every plan -- DML, console
-- =====================================================
-- Not needed right after section 1, since DEFAULT FALSE already did this.
-- Keep it for the yearly reset: run it when a new plan year opens, before
-- flagging that year's genuinely new plans, so last year's badges do not
-- linger. It touches every row in both plan years.
UPDATE `plan` SET `new_plan` = FALSE;

-- =====================================================
-- 3. Flagging a plan -- DML, console
-- =====================================================
-- By CMS id and year, which is the most precise handle. This example flags
-- UnitedHealthcare OR-6 as new for 2026:
--
-- UPDATE `plan` SET `new_plan` = TRUE WHERE `cms_plan_id` = 'H3805-041-000' AND `plan_year` = 2026;
--
-- By plan group, when both years of a plan should carry the badge:
--
-- UPDATE `plan` SET `new_plan` = TRUE WHERE `plan_group_id` = 38;

-- =====================================================
-- 4. Verification
-- =====================================================
-- Every flagged row, so you can see at a glance what carries a badge
SELECT `id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `new_plan` FROM `plan` WHERE `new_plan` = TRUE ORDER BY `plan_year`, `plan_name`;

-- Count by year -- after section 2 alone, both counts are 0
SELECT `plan_year`, SUM(`new_plan` = TRUE) AS flagged, COUNT(*) AS total FROM `plan` GROUP BY `plan_year`;
