-- =====================================================
-- v8: add PacificSource and Atrio, and their county pairings
-- =====================================================
-- DML, not a schema change. Run directly against the database (PlanetScale
-- console or `pscale shell`), NOT as a deploy request -- deploy requests
-- carry schema only, so INSERTs in one are silently dropped.
--
-- The PlanetScale console runs ONE statement at a time. Every statement
-- below is a single line: paste and run them one at a time, in order.
--
-- Ids continue the sequence in data.sql. Id 5 was previously a commented-out
-- placeholder for Regence, which was never inserted; PacificSource takes it,
-- so a future Regence row would use the next free id instead.
--
-- No plan rows are created here. The explore page builds each county's
-- company list from counties_companies, not from the plan rows, so these
-- buttons appear immediately and each shows the "no plans yet" message until
-- plans are added and linked through counties_plan.

-- ---- companies ----
INSERT INTO `company` (`id`, `company_name`) VALUES (5, "PacificSource");
INSERT INTO `company` (`id`, `company_name`) VALUES (6, "Atrio");

-- ---- company-county links ----

-- PacificSource (5): Lane (5)
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (5, 5);

-- Atrio (6): Lane (5), Yamhill (6)
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (6, 5);
INSERT INTO `counties_companies` (`company_id`, `county_id`) VALUES (6, 6);

-- ---- verification ----
SELECT c.`id`, c.`county_name`, GROUP_CONCAT(co.`company_name` ORDER BY co.`id`) AS companies FROM `county` c LEFT JOIN `counties_companies` cc ON cc.`county_id` = c.`id` LEFT JOIN `company` co ON co.`id` = cc.`company_id` GROUP BY c.`id`, c.`county_name` ORDER BY c.`id`;
