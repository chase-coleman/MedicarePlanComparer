-- =====================================================
-- v4: add Clatsop, Lane, and Yamhill counties
-- =====================================================
-- Run once against an existing database. data.sql already carries these rows
-- for fresh installs, so this file is only for databases created before these
-- counties existed.
--
-- Ids are set explicitly to match ALL_COUNTIES in
-- frontend/src/data/constants.js, which mirrors county.id.
--
-- PlanetScale's web console takes one statement at a time, so run these in
-- order, one paste per statement. Each is a standalone single-line command.
--
-- No counties_plan rows are created here: no plan is assigned to these
-- counties yet. Until plans are linked, each company button in these counties
-- shows the "no plans yet" message the explore page renders.

-- ---- counties ----
INSERT INTO `county` (`id`, `county_name`) VALUES (4, "Clatsop");
INSERT INTO `county` (`id`, `county_name`) VALUES (5, "Lane");
INSERT INTO `county` (`id`, `county_name`) VALUES (6, "Yamhill");

-- ---- company-county links ----
-- The explore page's company list for a county comes from this table, not
-- from the plan rows, so a company missing here never appears in that county.

-- Clatsop (4): Devoted
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (1, 4);

-- Lane (5): Devoted, UnitedHealthcare, Wellcare
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (1, 5);
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (3, 5);
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (4, 5);

-- Yamhill (6): Devoted, UnitedHealthcare, Wellcare
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (1, 6);
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (3, 6);
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (4, 6);

-- ---- verification ----
SELECT c.id, c.county_name, GROUP_CONCAT(co.company_name ORDER BY co.id) AS companies FROM `county` c LEFT JOIN `counties_companies` cc ON cc.county_id = c.id LEFT JOIN `company` co ON co.id = cc.company_id GROUP BY c.id, c.county_name ORDER BY c.id;
