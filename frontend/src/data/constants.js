export const PLAN_YEARS = ["2026", "2027"]

// The year CMS has not finished publishing. A plan with no record for this
// year keeps its toggle option, which renders the "not available until
// October 1st" message. A missing earlier year means the site never carried
// the plan that year, so PlanComponent drops that option instead.
export const UPCOMING_PLAN_YEAR = PLAN_YEARS[PLAN_YEARS.length - 1]

// The counties the explore page offers. `id` mirrors county.id in the
// database so the two lists cannot drift; the API itself is keyed by name.
export const ALL_COUNTIES = [
  { id: 1, countyName: "Linn" },
  { id: 2, countyName: "Tillamook" },
  { id: 3, countyName: "Lincoln" },
  { id: 4, countyName: "Clatsop" },
  { id: 5, countyName: "Lane" },
  { id: 6, countyName: "Yamhill" },
]

export const API_URL = import.meta.env.VITE_API_ENDPOINT

// Disclaimers
export const AFFILIATION_DISCLAIMER = "Not connected with or endorsed by the United States government or the federal Medicare program."
export const CURRENT_INFO_DISCLAIMER = "Plan availability, benefits, premiums, and costs may change on January 1 of each year. Information provided here is current as of 09/2025, but is subject to change."
export const LINN_CO_DISCLAIMER = "We do not offer every plan available in your area. In Linn County, we represent 5 organizations which offer 21 products in the county. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options."
export const LINCOLN_CO_DISCLAIMER = "We do not offer every plan available in your area. In Lincoln County, we represent 1 organization which offer 4 products in the county. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options."
export const TILLAMOOK_CO_DISCLAIMER = "We do not offer every plan available in your area. In Tillamook County, we represent 1 organization which offer 4 products in the county. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options."
export const PLAN_OFFERING_DISCLAIMER = "We do not offer every plan available in your area. Please contact Medicare.gov, 1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options." 
// County-specific plan-offering disclaimers, keyed by the county name the
// explore page stores. A county with no entry here falls back to the generic
// PLAN_OFFERING_DISCLAIMER, so a new county can ship before its organization
// and product counts are confirmed.
export const COUNTY_DISCLAIMERS = {
  Linn: LINN_CO_DISCLAIMER,
  Lincoln: LINCOLN_CO_DISCLAIMER,
  Tillamook: TILLAMOOK_CO_DISCLAIMER,
}

export const countyDisclaimer = (countyName) =>
  COUNTY_DISCLAIMERS[countyName] ?? PLAN_OFFERING_DISCLAIMER

export const JMCOLE_DISCLAIMER = "JMColegroup complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex. ATTENTION: If you speak a language other than English, language assistance services, free of charge, are available to you. Call 1-800-MEDICARE (TTY: 1-877-486-2048)."

// Trademark / copyright line rendered beneath the footer disclaimers
export const TRADEMARK = "JMColegroup™"
export const TRADEMARK_NOTICE = `© ${new Date().getFullYear()} ${TRADEMARK}. All rights reserved.`
