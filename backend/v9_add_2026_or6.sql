-- =====================================================
-- v9: add the 2026 row for UnitedHealthcare OR-6
-- =====================================================
-- DML, not a schema change. Run directly against the database (PlanetScale
-- console or `pscale shell`), NOT as a deploy request -- deploy requests
-- carry schema only, so INSERTs in one are silently dropped.
--
-- OR-6 (H3805-041-000) reached the database as a 2027 row only:
-- id=139, plan_group_id=38, linked to Lane (5) and Yamhill (6). Nothing
-- represented it in 2026, so those counties showed the plan under the 2027
-- toggle and nothing under 2026.
--
-- The new row reuses plan_group_id 38. That is what pairs the two years for
-- the UI's year toggle -- a fresh group id would leave each year showing a
-- plan the other year does not have.
--
-- id 39 follows the file's 2026-id + 100 convention against the existing
-- 2027 row (139). Confirm it is free before inserting; statement 1 below
-- must return 0 rows.
--
-- The 2026 benefits differ from the 2027 row's on purpose: moop 6700 vs
-- 7150, hospital stay 550 x 5 days vs 685 x 4, surgery 500-550 vs 635-685,
-- radiology 320 vs 260, dental 2000 vs 1250, OTC 45 vs 25.
--
-- benefits_published is TRUE: every figure here is a real published 2026
-- benefit, including dr_visit = 0 (a $0 copay) and radiology_coinsurance = 0
-- (the plan charges a flat $260 copay, not coinsurance).
--
-- The PlanetScale console runs ONE statement at a time. Every statement
-- below is a single line: paste and run them one at a time, in order.
--
-- uk_plan_group_year (plan_group_id, plan_year) makes statement 2 safe to
-- re-run: a second attempt fails with "Duplicate entry '38-2026'" rather
-- than creating a second 2026 row for the plan.
--
-- UnitedHealthcare (company_id = 3) already has counties_companies rows for
-- Lane and Yamhill, so no company-county link is needed here.

-- =====================================================
-- 1. Confirm id 39 is free -- must return 0 rows
-- =====================================================
SELECT `id`, `plan_name`, `plan_year` FROM `plan` WHERE `id` = 39;

-- =====================================================
-- 2. The 2026 plan row
-- =====================================================
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (39, 38, 'OR-6', 'H3805-041-000', 2026, TRUE, 0.00, 6700, 'HMO-POS', 0, 130, 550, 5, 500, 550, TRUE, 260, 260, 0, 2000, 45, 'Quarterly', 0.00, TRUE, 3);

-- =====================================================
-- 3. County links -- Lane (5) and Yamhill (6)
-- =====================================================
-- These mirror the 2027 row's links, so both years offer the plan in the
-- same two counties. Section 2 must finish first: counties_plan references
-- the plan id created there.
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (39, 5);
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (39, 6);

-- =====================================================
-- 4. Verification
-- =====================================================
-- Both years of OR-6, each showing "Lane,Yamhill"
SELECT p.`id`, p.`plan_group_id`, p.`plan_name`, p.`cms_plan_id`, p.`plan_year`, p.`benefits_published`, GROUP_CONCAT(c.`county_name` ORDER BY c.`id`) AS counties FROM `plan` p LEFT JOIN `counties_plan` cp ON cp.`plan_id` = p.`id` LEFT JOIN `county` c ON c.`id` = cp.`county_id` WHERE p.`plan_group_id` = 38 GROUP BY p.`id`, p.`plan_group_id`, p.`plan_name`, p.`cms_plan_id`, p.`plan_year`, p.`benefits_published` ORDER BY p.`plan_year`;

-- Patriot is untouched -- both rows must still read H2406-073-000 / PPO
SELECT `id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `plan_type` FROM `plan` WHERE `plan_group_id` = 11 ORDER BY `plan_year`;
