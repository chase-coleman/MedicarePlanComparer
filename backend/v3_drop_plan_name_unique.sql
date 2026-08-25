-- =====================================================
-- v3: drop the unique key on plan.plan_name
-- =====================================================
-- v1_init.sql used to declare UNIQUE KEY `uk_plan_plan_name` (`plan_name`).
-- That constraint is wrong: plan_name is not unique and never was.
--
--   * Same name, different county:  Devoted "Core" in Tillamook (id 2) and
--     in Lincoln/Linn (id 5) are separate plans with different benefits.
--   * Same name, same county:       Humana lists two "HumanaChoice" plans
--     in Linn (ids 7 and 8) that differ by premium ($0 vs $87).
--   * Same name, different year:    plan_year now multiplies every row.
--
-- Production never had this index, so this script is a no-op there. It is
-- guarded so it is safe to run against any database, including ones built
-- from the old v1_init.sql.

SET @idx := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'plan'
    AND INDEX_NAME = 'uk_plan_plan_name'
);

SET @sql := IF(@idx > 0,
  'ALTER TABLE `plan` DROP INDEX `uk_plan_plan_name`',
  'SELECT "uk_plan_plan_name not present - nothing to drop" AS result'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
