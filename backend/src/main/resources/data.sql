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
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  1, 1, "Giveback", NULL, 2026, true, 0, 7900, "HMO", 0, 115, 385, 5, 385, 525, true, 100, 300, 0, 250, 0, "None", 154.20, true, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  2, 2, "Core", NULL, 2026, true, 0, 5900, "HMO", 0, 130, 375, 5, 375, 475, true, 100, 300, 0, 2000, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  3, 3, "Premium", NULL, 2026, true, 43.20, 5900, "HMO", 0, 130, 375, 5, 375, 475, true, 100, 300, 0, 3000, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  4, 4, "Choice Premium", NULL, 2026, true, 29, 5900, "PPO", 0, 130, 325, 5, 325, 425, true, 100, 300, 0, 2000, 30, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  5, 5, "Core", NULL, 2026, true, 0, 5900, "HMO", 0, 130, 425, 4, 425, 525, true, 100, 400, 0, 1500, 40, "Quarterly", 0, true, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  6, 6, "Premium", NULL, 2026, true, 47.50, 5900, "HMO", 0, 130, 425, 4, 425, 525, true, 100, 400, 0, 3000, 40, "Quarterly", 0, true, 1
);


-- ##########################
-- ###### Humana Plans ######
-- ##########################
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  7, 7, "HumanaChoice", NULL, 2026, true, 0, 6750, "PPO", 0, 130, 495, 5, 200, 495, true, 200, 335, 0, 1500, 0, "None", 0, true, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  8, 8, "HumanaChoice", NULL, 2026, true, 87, 6750, "PPO", 0, 130, 325, 4, 0, 0, false, 200, 335, 0, 1000, 0, "None", 0, true, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  9, 9, "USAA Honor Giveback", NULL, 2026, true, 0, 9150, "PPO", 0, 115, 600, 4, 350, 495, true, 200, 335, 0, 1500, 50, "Quarterly", 125, true, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  10, 10, "USAA Honor Giveback", NULL, 2026, true, 0, 5100, "PPO", 0, 130, 480, 5, 350, 480, true, 200, 335, 0, 2500, 50, "Quarterly", 30, true, 2
);

-- ##########################
-- ###### United Plans ######
-- ##########################
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  11, 11, "Patriot", NULL, 2026, true, 0, 6700, "PPO", 0, 125, 495, 5, 495, 495, true, 250, 250, 0, 1500, 75, "Quarterly", 115, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  12, 12, "Essentials OR-4", NULL, 2026, true, 0, 5500, "HMO-POS", 0, 135, 455, 5, 405, 455, true, 260, 260, 0, 0, 25, "Quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  13, 13, "Essentials OR-0003", NULL, 2026, true, 69, 5200, "HMO-POS", 0, 130, 425, 5, 375, 425, true, 220, 220, 0, 1500, 0, "None", 0, true, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  14, 14, "Essentials OR-0001", NULL, 2026, true, 74, 5700, "PPO", 0, 130, 455, 6, 305, 455, true, 200, 200, 0, 1000, 0, "None", 0, true, 3
);

-- ##########################
-- ###### Wellcare Plans #####
-- ##########################
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  15, 15, "Giveback Open", NULL, 2026, true, 0, 9250, "PPO", 0, 115, 475, 5, 300, 500, true, 225, 500, 0, 0, 0, "None", 10, true, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  16, 16, "Patriot Giveback Open", NULL, 2026, true, 0, 6750, "PPO", 0, 130, 525, 5, 200, 500, true, 125, 500, 0, 1000, 15, "Monthly", 50, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  17, 17, "Simple", NULL, 2026, true, 0, 7500, "HMO-POS", 0, 115, 600, 4, 250, 500, true, 100, 500, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  18, 18, "Simple Open", NULL, 2026, true, 0, 6750, "PPO", 0, 130, 600, 4, 250, 500, true, 300, 400, 0, 1500, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  19, 19, "Low Premium", NULL, 2026, true, 35, 7900, "HMO-POS", 0, 115, 600, 4, 300, 500, true, 200, 400, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  20, 20, "Low Premium Open", NULL, 2026, true, 59, 7000, "PPO", 0, 115, 475, 5, 350, 500, true, 250, 500, 0, 0, 0, "None", 0, true, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  21, 21, "Premium Ultra Open", NULL, 2026, true, 160, 6500, "PPO", 0, 130, 425, 7, 200, 425, true, 125, 425, 0, 2000, 0, "None", 0, true, 4
);


-- ######################
-- ###### C-SNPs ######
-- ######################
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  22, 22, "Complete Care OR-5", NULL, 2026, true, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 40, "Quarterly", 0, true, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  23, 23, "Complete Care Support OR-1A", NULL, 2026, true, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 3000, 194, "Monthly", 0, true, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, 
radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  24, 24, "C-SNP Plus", NULL, 2026, true, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 3000, 314, "Monthly", 0, true, 1
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


-- ############################################
-- ###### 2027 PLACEHOLDERS (benefits TBD) ######
-- ############################################
-- Same plan_group_id as the 2026 row, so the UI pairs them. Every
-- benefit is zeroed and benefits_published is false, so the client
-- renders N/A until real CMS figures are entered.
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  101, 1, "Giveback", NULL, 2027, false, 0, 0, "HMO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  102, 2, "Core", NULL, 2027, false, 0, 0, "HMO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  103, 3, "Premium", NULL, 2027, false, 0, 0, "HMO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  104, 4, "Choice Premium", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  105, 5, "Core", NULL, 2027, false, 0, 0, "HMO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  106, 6, "Premium", NULL, 2027, false, 0, 0, "HMO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  107, 7, "HumanaChoice", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  108, 8, "HumanaChoice", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  109, 9, "USAA Honor Giveback", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  110, 10, "USAA Honor Giveback", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 2
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  111, 11, "Patriot", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  112, 12, "Essentials OR-4", NULL, 2027, false, 0, 0, "HMO-POS", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  113, 13, "Essentials OR-0003", NULL, 2027, false, 0, 0, "HMO-POS", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  114, 14, "Essentials OR-0001", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  115, 15, "Giveback Open", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  116, 16, "Patriot Giveback Open", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  117, 17, "Simple", NULL, 2027, false, 0, 0, "HMO-POS", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  118, 18, "Simple Open", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  119, 19, "Low Premium", NULL, 2027, false, 0, 0, "HMO-POS", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  120, 20, "Low Premium Open", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  121, 21, "Premium Ultra Open", NULL, 2027, false, 0, 0, "PPO", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 4
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  122, 22, "Complete Care OR-5", NULL, 2027, false, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  123, 23, "Complete Care Support OR-1A", NULL, 2027, false, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 3
);
INSERT INTO plan (id, plan_group_id, plan_name, cms_plan_id, plan_year, benefits_published, monthly_premium, moop, plan_type, dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery_min, surgery_max, surgery_copay_type, radiology_copay_min, radiology_copay_max, radiology_coinsurance, dental_benefit, otc_credit, otc_renewal, giveback_amount, rx_coverage, company_id
) VALUES (
  124, 24, "C-SNP Plus", NULL, 2027, false, 0, 0, "C-SNP", 0, 0, 0, 0, 0, 0, false, 0, 0, 0, 0, 0, "None", 0, false, 1
);

-- county availability mirrored from 2026 for the placeholders
INSERT INTO counties_plan (plan_id, county_id) VALUES (101, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (102, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (103, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (104, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (124, 2);
INSERT INTO counties_plan (plan_id, county_id) VALUES (101, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (105, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (106, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (124, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (101, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (105, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (106, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (124, 3);
INSERT INTO counties_plan (plan_id, county_id) VALUES (107, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (108, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (109, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (110, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (111, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (112, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (113, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (114, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (115, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (116, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (117, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (118, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (119, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (120, 1);
INSERT INTO counties_plan (plan_id, county_id) VALUES (121, 1);
