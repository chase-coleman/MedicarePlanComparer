// Legal and CMS-required text rendered in the site footer.

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

export const ABOUT_JMCOLE_DISCLAIMER = "If you are going to work with a company to partner with you in your healthcare needs, you want to know a little about them. As we would want to know about you, we want you to know about us as well. As a company, JMCole Group is a part of the Medicare Plans Resource Center located in Eugene, Oregon. We have partnered with hundreds of individuals throughout the state or Oregon to get them the very best Medicare coverage that fits their needs."

// Disclaimers rendered at the bottom of every plan card. Each entry takes the
// selected company's name, since some of the CMS-required wording names it.
export const PLAN_DISCLAIMERS = [
  () => "This is a brief summary, not a complete description of benefits. For more information, please refer to the plan’s Evidence of Coverage (EOC) or Summary of Benefits. Limitations, copayments, and restrictions may apply.",
  (company) => `${company} is a Medicare Advantage plan with a Medicare contract. Enrollment in ${company} depends on contract renewal.`,
  () => "All copays/coinsurance amounts shown are in-network. PPO plans that offer out-of-network coverage may have higher coverage costs for those services.",
]

// Consent language shown beneath the submit button of the request-contact and RSVP forms.
export const SOA_DISCLAIMER = "By submitting this form, you agree that a licensed sales agent may contact you by phone, text, or email to discuss Medicare Advantage, Prescription Drug, and Medicare Supplement Insurance plans."
