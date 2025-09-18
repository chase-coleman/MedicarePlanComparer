CREATE TABLE IF NOT EXISTS `company` (
  `id`            BIGINT NOT NULL AUTO_INCREMENT,
  `company_name`  VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_company_company_name` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `county` (
  `id`           BIGINT NOT NULL AUTO_INCREMENT,
  `county_name`  VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `plan` (
  `id`                      BIGINT NOT NULL AUTO_INCREMENT,
  `plan_name`               VARCHAR(255) NOT NULL,
  `monthly_premium`         DECIMAL(10,2) NOT NULL,
  `moop`                    INT NOT NULL,
  `plan_type`               VARCHAR(255) NOT NULL,
  `dr_visit`                INT NOT NULL,
  `er_visit`                INT NOT NULL,
  `hospital_stay`           INT NOT NULL,
  `hospital_stay_length`    INT NOT NULL,
  `surgery_min`             INT NOT NULL,
  `surgery_max`             INT NOT NULL,
  `surgery_copay_type`      BOOLEAN NOT NULL,
  `radiology_copay_max`     INT NOT NULL,
  `radiology_copay_min`     INT NOT NULL,
  `radiology_coinsurance`   INT NOT NULL,
  `dental_benefit`          INT NOT NULL,
  `otc_credit`              INT NOT NULL,
  `otc_renewal`             VARCHAR(255) NOT NULL,
  `giveback_amount`         DECIMAL(10,2) NOT NULL,
  `rx_coverage`             BOOLEAN NOT NULL,
  `company_id`              BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_plan_plan_name` (`plan_name`),
  KEY `idx_plan_company_id` (`company_id`)   -- logical FK to company(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================
-- Join tables
-- =====================

-- Plan <-> County (Many-to-Many) via Plan.counties @JoinTable(name="counties_plan")
CREATE TABLE IF NOT EXISTS `counties_plan` (
  `plan_id`    BIGINT NOT NULL,
  `county_id`  BIGINT NOT NULL,
  PRIMARY KEY (`plan_id`, `county_id`),
  KEY `idx_counties_plan_county_id` (`county_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Company <-> County (Many-to-Many) via Company.counties @JoinTable(name="counties_companies")
CREATE TABLE IF NOT EXISTS `counties_companies` (
  `company_id` BIGINT NOT NULL,
  `county_id`  BIGINT NOT NULL,
  PRIMARY KEY (`company_id`, `county_id`),
  KEY `idx_counties_companies_county_id` (`county_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*
Notes:
- PlanetScale (Vitess) does not support FOREIGN KEY constraints; we use indexes instead.
- JPA/Hibernate will still manage relationships via the join tables.
- If your app uses a different naming strategy (not snake_case), adjust column names accordingly.
*/