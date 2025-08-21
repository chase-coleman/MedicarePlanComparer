-- companies
INSERT IGNORE INTO company (company_name) VALUES ("Devoted");
INSERT IGNORE INTO company (company_name) VALUES ("United Healthcare");
INSERT IGNORE INTO company (company_name) VALUES ("Providence");

-- counties
INSERT IGNORE INTO county (county_name) VALUES ("Linn");
INSERT IGNORE INTO county (county_name) VALUES ("Tillamook");
INSERT IGNORE INTO county (county_name) VALUES ("Lincoln");

-- plans
-- INSERT INTO plan (plan_name, monthly_premium, moop, plan_type, 
-- dr_visit, er_visit, hospital_stay, hospital_stay_length, surgery, radiology, 
-- dental_benefit, otc_credit, company_id
-- ) VALUES (
--   "Core", 0, 5900, "HMO", 0, 125, 425, 4, 525, 20
-- )