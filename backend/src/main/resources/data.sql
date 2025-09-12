-- Clearing existing Data
DELETE FROM counties_plan;
DELETE FROM counties_companies;
DELETE FROM plan;
DELETE FROM county;
DELETE FROM company;

-- #######################
-- ###### Companies ######
-- #######################
INSERT INTO company (id, company_name) VALUES (1, "Devoted");
INSERT INTO company (id, company_name) VALUES (2, "UnitedHealthcare");
INSERT INTO company (id, company_name) VALUES (3, "Aetna");
INSERT INTO company (id, company_name) VALUES (4, "Humana");
INSERT INTO company (id, company_name) VALUES (5, "Regence");
INSERT INTO company (id, company_name) VALUES (6, "Wellcare");

-- ###################
-- ###### PLANS ######
-- ###################
-- Devoted Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  1, "Core", 0, 5900, "HMO", 0, 125, 425, 4, 425, 525, true, 100, 400, 0, 1000, 82, "monthly", 0, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  2, "Giveback", 0, 7900, "HMO", 0, 110, 375, 5, 385, 475, true, 100, 300, 0, 250, 0, "None", 137.60, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  3, "Premium", 15.60, 5900, "HMO", 0, 125, 425, 4, 425, 525, true, 100, 400, 0, 1500, 75, "monthly", 0, true, 1
);

-- UHC Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  4, "Plan 4", 16, 4500, "HMO-POS", 0, 125, 400, 4, 350, 400, true, 225, 225, 0, 0, 35, "quarterly", 0, true, 2
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  5, "Plan 3", 46, 3500, "HMO-POS", 0, 140, 395, 5, 345, 395, true, 230, 230, 0, 1500, 0, "None", 0, true, 2
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  6, "Plan 1", 49, 4900, "PPO", 0, 125, 395, 6, 245, 395, true, 250, 250, 0, 1250, 25, "quarterly", 0, true, 2
);
-- NO PART D
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  7, "Patriot", 0, 6700, "PPO", 0, 125, 495, 5, 495, 495, true, 250, 250, 0, 1500, 75, "quarterly", 115, false, 2
);

-- Aetna Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  8, "Elite", 0, 5900, "HMO-POS", 0, 120, 395, 5, 300, 300, true, 0, 225, 0, 1250, 30, "quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  9, "Preferred", 0, 6900, "PPO", 0, 110, 425, 5, 325, 325, true, 0, 275, 0, 1250, 30, "quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  10, "Value", 0, 6350, "HMO-POS", 0, 125, 425, 5, 345, 345, true, 0, 275, 0, 850, 0, "None", 0, true, 3
);

-- NO PART D
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  11, "Greater Portland Eagle", 0, 5900, "PPO", 0, 125, 430, 5, 295, 295, true, 0, 350, 0, 1500, 75, "quarterly", 50, false, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  12, "Eagle", 0, 5900, "PPO", 0, 125, 430, 5, 295, 295, true, 0, 350, 0, 1250, 75, "quarterly", 50, false, 3
);

-- Humana Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  13, "HumanaChoice", 0, 6750, "PPO", 0, 125, 495, 5, 350, 495, true, 270, 495, 0, 1500, 75, "quarterly", 0, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  14, "Honor Giveback", 0, 6750, "PPO", 0, 125, 495, 5, 350, 495, true, 270, 495, 0, 1500, 75, "quarterly", 100, true, 4
);

-- Regence Plans
-- NO RX COVERAGE
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  15, "Valiance", 0, 5500, "HMO", 0, 120, 400, 4, 300, 355, true, 0, 0, 20, 1000, 50, "quarterly", 50, false, 5
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  16, "Classic", 75, 5500, "PPO", 0, 120, 400, 4, 355, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 5
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  17, "Enhanced", 15, 5000, "PPO", 0, 120, 400, 4, 300, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 5
);


INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  18, "Simple Open", 15, 5000, "PPO", 0, 120, 400, 4, 270, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  19, "Simple", 15, 5000, "PPO", 0, 120, 400, 4, 270, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  20, "Simple Value", 15, 5000, "PPO", 0, 120, 400, 4, 355, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
-- NO PART D
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  21, "Giveback Open", 15, 5000, "PPO", 0, 120, 400, 4, 355, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  22, "Patriot Giveback", 15, 5000, "PPO", 0, 120, 400, 4, 300, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, false, 6
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  23, "Low Premium Open", 10, 5000, "PPO", 0, 120, 400, 4, 320, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  24, "Premium Ultra Open", 15, 5000, "PPO", 0, 120, 400, 4, 355, 355, true, 0, 0, 20, 1000, 50, "quarterly", 0, true, 6
);
-- ######################
-- ###### COUNTIES ######
-- ######################
INSERT INTO county (id, county_name) VALUES (1, "Linn");
INSERT INTO county (id, county_name) VALUES (2, "Tillamook");
INSERT INTO county (id, county_name) VALUES (3, "Lincoln");


-- ####################################
-- ###### PLAN-COUNTY JOIN TABLE ######
-- ####################################
-- Devoted Plans in Lincoln County
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (2, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (3, 3);
-- Devoted Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (2, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (3, 1);
-- UHC Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (4, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (5, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (6, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (7, 1);
-- Aetna Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (8, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (9, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (10, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (11, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (12, 1);
-- Humana Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (13, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (14, 1);
-- Regence plans into Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (15, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (16, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (17, 1);
-- Wellcare Plans into Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (18, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (19, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (20, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (21, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (22, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (23, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (24, 1);

-- #######################################
-- ###### COMPANY-COUNTY JOIN TABLE ######
-- #######################################
-- Devoted into it's counties
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 1);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 2);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 3);
-- UHC into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (2, 1);
-- Aetna into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (3, 1);
-- Humana into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (4, 1);
-- Regence into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (5, 1);
-- Wellcare into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (6, 1);