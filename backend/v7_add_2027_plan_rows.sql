-- =====================================================
-- v7: add the 2027 plan rows
-- =====================================================
-- DML, not a schema change. Run directly against the database (PlanetScale
-- console or `pscale shell`), NOT as a deploy request -- deploy requests
-- carry schema only, so INSERTs in one are silently dropped.
--
-- Production has 2026 rows only. The 2027 placeholders have always lived in
-- data.sql, which seeds fresh local databases and never ran against
-- production, so no 2027 row was ever created there. An UPDATE against a
-- 2027 row therefore matches 0 rows -- this file creates the rows first.
--
-- The PlanetScale console runs ONE statement at a time. Every statement
-- below is a single line: paste and run them one at a time, in order.
--
-- Ids are explicit and follow data.sql's convention of 2026 id + 100, so
-- production and the seed file stay readable side by side. Each row reuses
-- its 2026 row's plan_group_id, which is what pairs the two years for the
-- UI's year toggle.
--
-- Every benefit is zeroed and benefits_published is FALSE, so the client
-- renders N/A rather than a real-looking $0 until CMS figures are entered.
-- cms_plan_id stays NULL for the same reason. Flip a row to published only
-- once its real figures are in (see the bottom of this file).
--
-- uk_plan_group_year (plan_group_id, plan_year) makes this safe to re-run:
-- a second attempt fails with "Duplicate entry '<group>-2027'" rather than
-- creating a second row for the same plan-year.
--
-- Section 1 must finish before section 2 -- counties_plan references these
-- plan ids.

-- =====================================================
-- 1. Plan rows (24)
-- =====================================================

-- ---- Devoted (company_id=1) ----
-- 101. Giveback
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (101, 1, 'Giveback', NULL, 2027, FALSE, 0, 0, 'HMO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);
-- 102. Core
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (102, 2, 'Core', NULL, 2027, FALSE, 0, 0, 'HMO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);
-- 103. Premium
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (103, 3, 'Premium', NULL, 2027, FALSE, 0, 0, 'HMO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);
-- 104. Choice Premium
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (104, 4, 'Choice Premium', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);
-- 105. Core
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (105, 5, 'Core', NULL, 2027, FALSE, 0, 0, 'HMO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);
-- 106. Premium
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (106, 6, 'Premium', NULL, 2027, FALSE, 0, 0, 'HMO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);

-- ---- Humana (company_id=2) ----
-- 107. HumanaChoice
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (107, 7, 'HumanaChoice', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 2);
-- 108. HumanaChoice
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (108, 8, 'HumanaChoice', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 2);
-- 109. USAA Honor Giveback
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (109, 9, 'USAA Honor Giveback', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 2);
-- 110. USAA Honor Giveback
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (110, 10, 'USAA Honor Giveback', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 2);

-- ---- UnitedHealthcare (company_id=3) ----
-- 111. Patriot
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (111, 11, 'Patriot', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);
-- 112. Essentials OR-4
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (112, 12, 'Essentials OR-4', NULL, 2027, FALSE, 0, 0, 'HMO-POS', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);
-- 113. Essentials OR-0003
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (113, 13, 'Essentials OR-0003', NULL, 2027, FALSE, 0, 0, 'HMO-POS', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);
-- 114. Essentials OR-0001
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (114, 14, 'Essentials OR-0001', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);

-- ---- Wellcare (company_id=4) ----
-- 115. Giveback Open
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (115, 15, 'Giveback Open', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 116. Patriot Giveback Open
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (116, 16, 'Patriot Giveback Open', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 117. Simple
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (117, 17, 'Simple', NULL, 2027, FALSE, 0, 0, 'HMO-POS', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 118. Simple Open
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (118, 18, 'Simple Open', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 119. Low Premium
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (119, 19, 'Low Premium', NULL, 2027, FALSE, 0, 0, 'HMO-POS', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 120. Low Premium Open
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (120, 20, 'Low Premium Open', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);
-- 121. Premium Ultra Open
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (121, 21, 'Premium Ultra Open', NULL, 2027, FALSE, 0, 0, 'PPO', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 4);

-- ---- UnitedHealthcare (company_id=3) ----
-- 122. Complete Care OR-5
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (122, 22, 'Complete Care OR-5', NULL, 2027, FALSE, 0, 0, 'C-SNP', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);
-- 123. Complete Care Support OR-1A
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (123, 23, 'Complete Care Support OR-1A', NULL, 2027, FALSE, 0, 0, 'C-SNP', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 3);

-- ---- Devoted (company_id=1) ----
-- 124. C-SNP Plus
INSERT INTO `plan` (`id`, `plan_group_id`, `plan_name`, `cms_plan_id`, `plan_year`, `benefits_published`, `monthly_premium`, `moop`, `plan_type`, `dr_visit`, `er_visit`, `hospital_stay`, `hospital_stay_length`, `surgery_min`, `surgery_max`, `surgery_copay_type`, `radiology_copay_min`, `radiology_copay_max`, `radiology_coinsurance`, `dental_benefit`, `otc_credit`, `otc_renewal`, `giveback_amount`, `rx_coverage`, `company_id`) VALUES (124, 24, 'C-SNP Plus', NULL, 2027, FALSE, 0, 0, 'C-SNP', 0, 0, 0, 0, 0, 0, FALSE, 0, 0, 0, 0, 0, 'None', 0, FALSE, 1);

-- =====================================================
-- 2. County availability (28)
-- =====================================================
-- Mirrored exactly from the 2026 counties_plan rows. A plan with no row
-- here never reaches the UI: PlanRepository joins through this table.
-- Plans 122 and 123 are deliberately absent, matching their 2026
-- counterparts 22 and 23, which have no county assignment either.

-- ---- Tillamook County (county_id=2) ----
-- Giveback
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (101, 2);
-- Core
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (102, 2);
-- Premium
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (103, 2);
-- Choice Premium
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (104, 2);
-- C-SNP Plus
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (124, 2);

-- ---- Linn County (county_id=1) ----
-- Giveback
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (101, 1);
-- Core
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (105, 1);
-- Premium
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (106, 1);
-- C-SNP Plus
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (124, 1);

-- ---- Lincoln County (county_id=3) ----
-- Giveback
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (101, 3);
-- Core
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (105, 3);
-- Premium
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (106, 3);
-- C-SNP Plus
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (124, 3);

-- ---- Linn County (county_id=1) ----
-- HumanaChoice
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (107, 1);
-- HumanaChoice
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (108, 1);
-- USAA Honor Giveback
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (109, 1);
-- USAA Honor Giveback
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (110, 1);
-- Patriot
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (111, 1);
-- Essentials OR-4
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (112, 1);
-- Essentials OR-0003
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (113, 1);
-- Essentials OR-0001
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (114, 1);
-- Giveback Open
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (115, 1);
-- Patriot Giveback Open
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (116, 1);
-- Simple
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (117, 1);
-- Simple Open
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (118, 1);
-- Low Premium
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (119, 1);
-- Low Premium Open
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (120, 1);
-- Premium Ultra Open
INSERT INTO `counties_plan` (`plan_id`, `county_id`) VALUES (121, 1);

-- =====================================================
-- Verification
-- =====================================================
-- 1. Count of 2027 plan rows -- must return 24
SELECT COUNT(*) AS plans_2027 FROM `plan` WHERE `plan_year` = 2027;

-- 2. Groups holding a 2026 row but no 2027 row -- must return 0 rows
SELECT a.`plan_group_id`, a.`plan_name` FROM `plan` a LEFT JOIN `plan` b ON b.`plan_group_id` = a.`plan_group_id` AND b.`plan_year` = 2027 WHERE a.`plan_year` = 2026 AND b.`id` IS NULL ORDER BY a.`plan_group_id`;

-- 3. County links per year -- both years must show the same count (28)
SELECT p.`plan_year`, COUNT(*) AS links FROM `counties_plan` cp JOIN `plan` p ON p.`id` = cp.`plan_id` GROUP BY p.`plan_year`;

-- 4. Any 2027 row wrongly marked published -- must return 0 rows
SELECT `id`, `plan_name` FROM `plan` WHERE `plan_year` = 2027 AND `benefits_published` = TRUE;

-- =====================================================
-- Entering real 2027 benefits
-- =====================================================
-- Once CMS publishes a plan's 2027 figures, update its row by plan_group_id
-- and set benefits_published = TRUE in the same statement. Devoted Core
-- (plan_group_id = 2) as the worked example:
--
-- UPDATE `plan` SET `cms_plan_id` = 'H2923-001-000', `monthly_premium` = 0.00, `moop` = 6700, `dr_visit` = 0, `er_visit` = 130, `hospital_stay` = 465, `hospital_stay_length` = 5, `surgery_copay_type` = TRUE, `surgery_min` = 465, `surgery_max` = 565, `dental_benefit` = 1750, `otc_credit` = 40, `otc_renewal` = 'Quarterly', `giveback_amount` = 0.00, `rx_coverage` = TRUE, `benefits_published` = TRUE WHERE `plan_group_id` = 2 AND `plan_year` = 2027;
--
-- Leave radiology alone unless you have real figures. With
-- benefits_published = TRUE and all three radiology columns at 0, the UI
-- prints "Radiology Copay: $0", which reads as a real $0 benefit rather
-- than as missing data.
