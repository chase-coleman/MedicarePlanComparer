-- =====================================================
-- v6: backfill cms_plan_id for the 2026 plans
-- =====================================================
-- DML, not a schema change. Run directly against the database, NOT as a
-- deploy request -- deploy requests carry schema only.
--
-- The PlanetScale console runs ONE statement at a time. Every statement
-- below is a single line: paste and run them one at a time, in order.
--
-- Segments are stored three digits wide: H2923-004-000, H5216-428-005.
-- Each UPDATE is guarded on plan_name and plan_year as well as id, so a
-- row that does not match is left alone rather than silently mis-set.

-- ---- Devoted ----
-- 1. Giveback  (Linn/Tillamook/Lincoln)
UPDATE `plan` SET `cms_plan_id` = 'H2923-004-000' WHERE `id` = 1 AND `plan_year` = 2026 AND `plan_name` = 'Giveback';

-- 2. Core  (Tillamook)
UPDATE `plan` SET `cms_plan_id` = 'H2923-001-000' WHERE `id` = 2 AND `plan_year` = 2026 AND `plan_name` = 'Core';

-- 3. Premium  (Tillamook)
UPDATE `plan` SET `cms_plan_id` = 'H2923-005-000' WHERE `id` = 3 AND `plan_year` = 2026 AND `plan_name` = 'Premium';

-- 4. Choice Premium  (Tillamook)
UPDATE `plan` SET `cms_plan_id` = 'H7199-002-000' WHERE `id` = 4 AND `plan_year` = 2026 AND `plan_name` = 'Choice Premium';

-- 5. Core  (Linn/Lincoln)
UPDATE `plan` SET `cms_plan_id` = 'H2923-003-000' WHERE `id` = 5 AND `plan_year` = 2026 AND `plan_name` = 'Core';

-- 6. Premium  (Linn/Lincoln)
UPDATE `plan` SET `cms_plan_id` = 'H2923-006-000' WHERE `id` = 6 AND `plan_year` = 2026 AND `plan_name` = 'Premium';

-- ---- Humana ----
-- 7. HumanaChoice  ($0 premium)
UPDATE `plan` SET `cms_plan_id` = 'H5216-428-005' WHERE `id` = 7 AND `plan_year` = 2026 AND `plan_name` = 'HumanaChoice';

-- 8. HumanaChoice  ($87 premium)
UPDATE `plan` SET `cms_plan_id` = 'H5216-048-000' WHERE `id` = 8 AND `plan_year` = 2026 AND `plan_name` = 'HumanaChoice';

-- 9. USAA Honor Giveback  ($125 giveback)
UPDATE `plan` SET `cms_plan_id` = 'H5216-427-002' WHERE `id` = 9 AND `plan_year` = 2026 AND `plan_name` = 'USAA Honor Giveback';

-- 10. USAA Honor Giveback  ($30 giveback)
UPDATE `plan` SET `cms_plan_id` = 'H5216-455-000' WHERE `id` = 10 AND `plan_year` = 2026 AND `plan_name` = 'USAA Honor Giveback';

-- ---- UnitedHealthcare ----
-- 11. Patriot
UPDATE `plan` SET `cms_plan_id` = 'H2406-073-000' WHERE `id` = 11 AND `plan_year` = 2026 AND `plan_name` = 'Patriot';

-- 12. Essentials OR-4
UPDATE `plan` SET `cms_plan_id` = 'H3805-039-002' WHERE `id` = 12 AND `plan_year` = 2026 AND `plan_name` = 'Essentials OR-4';

-- 13. Essentials OR-0003
UPDATE `plan` SET `cms_plan_id` = 'H3805-001-000' WHERE `id` = 13 AND `plan_year` = 2026 AND `plan_name` = 'Essentials OR-0003';

-- 14. Essentials OR-0001
UPDATE `plan` SET `cms_plan_id` = 'H2406-042-000' WHERE `id` = 14 AND `plan_year` = 2026 AND `plan_name` = 'Essentials OR-0001';

-- ---- Wellcare ----
-- 15. Giveback Open
UPDATE `plan` SET `cms_plan_id` = 'H5439-015-000' WHERE `id` = 15 AND `plan_year` = 2026 AND `plan_name` = 'Giveback Open';

-- 16. Patriot Giveback Open
UPDATE `plan` SET `cms_plan_id` = 'H5439-010-000' WHERE `id` = 16 AND `plan_year` = 2026 AND `plan_name` = 'Patriot Giveback Open';

-- 17. Simple
UPDATE `plan` SET `cms_plan_id` = 'H6815-039-000' WHERE `id` = 17 AND `plan_year` = 2026 AND `plan_name` = 'Simple';

-- 18. Simple Open
UPDATE `plan` SET `cms_plan_id` = 'H5439-022-003' WHERE `id` = 18 AND `plan_year` = 2026 AND `plan_name` = 'Simple Open';

-- 19. Low Premium
UPDATE `plan` SET `cms_plan_id` = 'H6815-038-000' WHERE `id` = 19 AND `plan_year` = 2026 AND `plan_name` = 'Low Premium';

-- 20. Low Premium Open
UPDATE `plan` SET `cms_plan_id` = 'H5439-019-000' WHERE `id` = 20 AND `plan_year` = 2026 AND `plan_name` = 'Low Premium Open';

-- 21. Premium Ultra Open
UPDATE `plan` SET `cms_plan_id` = 'H5439-011-000' WHERE `id` = 21 AND `plan_year` = 2026 AND `plan_name` = 'Premium Ultra Open';

-- ---- Devoted ----
-- 22. C-SNP Plus  (Linn/Tillamook/Lincoln)
UPDATE `plan` SET `cms_plan_id` = 'H2923-009-000' WHERE `id` = 24 AND `plan_year` = 2026 AND `plan_name` = 'C-SNP Plus';

-- =====================================================
-- Verification
-- =====================================================
-- 23. Count of 2026 plans that now have a CMS id -- must return 22
SELECT COUNT(*) AS plans_with_cms_id FROM `plan` WHERE `plan_year` = 2026 AND `cms_plan_id` IS NOT NULL;

-- 24. 2026 plans still missing a CMS id -- should list only 22 and 23
SELECT `id`, `plan_name`, `plan_type`, `company_id` FROM `plan` WHERE `plan_year` = 2026 AND `cms_plan_id` IS NULL ORDER BY `id`;

-- 25. Duplicate CMS ids -- must return 0 rows
SELECT `cms_plan_id`, COUNT(*) AS n FROM `plan` WHERE `plan_year` = 2026 AND `cms_plan_id` IS NOT NULL GROUP BY `cms_plan_id` HAVING COUNT(*) > 1;
