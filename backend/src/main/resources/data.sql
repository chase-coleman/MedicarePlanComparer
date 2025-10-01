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
INSERT INTO company (id, company_name) VALUES (2, "Humana");
INSERT INTO company (id, company_name) VALUES (3, "UnitedHealthcare");
INSERT INTO company (id, company_name) VALUES (4, "Wellcare");
-- INSERT INTO company (id, company_name) VALUES (5, "Regence");

-- ###################
-- ###### PLANS ######
-- ###################
-- Devoted Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  1, "Giveback", 0, 7900, "HMO", 0, 115, 385, 5, 385, 525, true, 100, 300, 0, 1250, 0, "None", 154.20, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  2, "Core", 0, 5900, "HMO", 0, 130, 375, 5, 375, 475, true, 100, 300, 0, 2000, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  3, "Premium", 43.20, 5900, "HMO", 0, 130, 375, 5, 375, 475, true, 100, 300, 0, 3000, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  4, "Choice Premium", 29, 5900, "PPO", 0, 130, 325, 5, 325, 425, true, 100, 300, 0, 2000, 30, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  5, "Core", 0, 5900, "HMO", 0, 130, 425, 4, 425, 525, true, 100, 400, 0, 1500, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  6, "Premium", 47.50, 5900, "HMO", 0, 130, 425, 4, 425, 525, true, 100, 400, 0, 3000, 40, "Quarterly", 0, true, 1
);


-- ##########################
-- ###### Humana Plans ######
-- ##########################
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  7, "HumanaChoice", 0, 6750, "PPO", 0, 130, 495, 5, 200, 495, true, 200, 335, 0, 1500, 0, "None", 0, true, 2
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  8, "HumanaChoice", 87, 6750, "PPO", 0, 130, 325, 4, 0, 0, false, 200, 335, 0, 1000, 0, "None", 0, true, 2
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  9, "USAA Honor Giveback", 0, 9150, "PPO", 0, 115, 600, 4, 350, 495, true, 200, 335, 0, 1500, 50, "Quarterly", 125, true, 2
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  10, "USAA Honor Giveback", 0, 5100, "PPO", 0, 130, 480, 5, 350, 480, true, 200, 335, 0, 2500, 50, "Quarterly", 30, true, 2
);

-- ##########################
-- ###### United Plans ######
-- ##########################
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  11, "Patriot", 0, 6700, "PPO", 0, 125, 495, 5, 495, 495, true, 250, 250, 0, 1500, 75, "Quarterly", 115, false, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  12, "Essentials OR-4", 16, 4500, "HMO-POS", 0, 125, 400, 4, 350, 400, true, 225, 225, 0, 0, 35, "Quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  13, "Essentials OR-0003", 46, 3500, "HMO-POS", 0, 140, 395, 5, 345, 395, true, 230, 230, 0, 1500, 0, "None", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  14, "Essentials OR-0001", 49, 4900, "PPO", 0, 125, 395, 6, 245, 395, true, 250, 250, 0, 1250, 25, "Quarterly", 0, true, 3
);

-- ##########################
-- ###### Wellcare Plans #####
-- ##########################
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  15, "Giveback Open", 0, 9250, "PPO", 0, 115, 475, 5, 300, 500, true, 225, 500, 0, 0, 0, "None", 10, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  16, "Patriot Giveback Open", 0, 6750, "PPO", 0, 130, 525, 5, 200, 500, true, 125, 500, 0, 1000, 15, "Monthly", 50, false, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  17, "Simple", 0, 7500, "HMO-POS", 0, 115, 600, 4, 250, 500, true, 100, 500, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  18, "Simple Open", 0, 6750, "PPO", 0, 130, 600, 4, 250, 500, true, 300, 400, 0, 1500, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  19, "Low Premium", 35, 7900, "HMO-POS", 0, 115, 600, 4, 300, 500, true, 200, 400, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  20, "Low Premium Open", 59, 7000, "PPO", 0, 115, 475, 5, 350, 500, true, 250, 500, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  21, "Premium Ultra Open", 160, 6500, "PPO", 0, 130, 425, 7, 200, 425, true, 125, 425, 0, 2000, 0, "None", 0, true, 4
);


-- ######################
-- ###### C-SNPs ######
-- ######################
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  22, "Complete Care OR-5", 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 40, "Quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  23, "Complete Care Support OR-1A", 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 3000, 194, "Monthly", 0, true, 3
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  24, "C-SNP Plus", 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 3000, 314, "Monthly", 0, true, 1
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
-- Devoted Plans in Tillamook County
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (2, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (3, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (4, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (24, 2);

-- Devoted Plans in Linn/Lincoln County
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 1); 
INSERT INTO counties_plan (plan_id, county_id) VALUES (5, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (6, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (24, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (5, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (6, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (24, 3);

-- Humana Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (7, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (8, 1); 
INSERT INTO counties_plan (plan_id, county_id) VALUES (9, 1); 
INSERT INTO counties_plan (plan_id, county_id) VALUES (10, 1);  

-- United Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (11, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (12, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (13, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (14, 1);

-- Wellcare Plans in Linn County
INSERT INTO counties_plan (plan_id, county_id) VALUES (15, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (16, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (17, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (18, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (19, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (20, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (21, 1);

-- #######################################
-- ###### COMPANY-COUNTY JOIN TABLE ######
-- #######################################
-- Devoted into it's counties
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 1);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 2);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 3);

-- Humana into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (2, 1);

-- UHC into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (3, 1);

-- Wellcare into Linn County
INSERT INTO counties_companies (company_id, county_id) VALUES (4, 1);
