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
INSERT INTO company (id, company_name) VALUES (2, "United Healthcare");
INSERT INTO company (id, company_name) VALUES (3, "Providence");

-- ###################
-- ###### PLANS ######
-- ###################
-- Devoted Plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery, 
radiology_copay, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, company_id
) VALUES (
  1, "Core", 0, 5900, "HMO", 0, 125, 425, 4, 525, 400, 0, 1000, 82, "monthly", 0, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery, 
radiology_copay, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, company_id
) VALUES (
  2, "Giveback", 0, 7900, "HMO", 0, 110, 375, 5, 475, 300, 0, 250, 0, "None", 137.60, 1
);
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery, 
radiology_copay, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, giveback_amount, company_id
) VALUES (
  3, "Premium", 15.60, 5900, "HMO", 0, 125, 425, 4, 525, 400, 0, 1500, 75, "monthly", 0, 1
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

-- #######################################
-- ###### COMPANY-COUNTY JOIN TABLE ######
-- #######################################
-- Devoted into it's companies
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 1);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 2);
INSERT INTO counties_companies (company_id, county_id) VALUES (1, 3);