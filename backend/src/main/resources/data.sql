-- Clearing existing Data
DELETE FROM counties_plan;
DELETE FROM plan;
DELETE FROM county;
DELETE FROM company;

-- companies
INSERT INTO company (id, company_name) VALUES (1, "Devoted");
INSERT INTO company (id, company_name) VALUES (2, "United Healthcare");
INSERT INTO company (id, company_name) VALUES (3, "Providence");

-- plans
INSERT INTO plan (id, plan_name, monthly_premium, moop, plan_type, 
dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery, 
radiology_copay, radiology_coinsurance, dental_benefit, 
otc_credit, otc_renewal, company_id
) VALUES (
  1, "Core", 0, 5900, "HMO", 0, 125, 425, 4, 525, 0, 20, 1000, 82, "monthly", 1
);


-- counties
INSERT INTO county (id, county_name) VALUES (1, "Linn");
INSERT INTO county (id, county_name) VALUES (2, "Tillamook");
INSERT INTO county (id, county_name) VALUES (3, "Lincoln");


-- plan-county join table
INSERT INTO counties_plan (plan_id, county_id) VALUES (1, 1);