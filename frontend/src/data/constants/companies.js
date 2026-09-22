// Standing notices shown beneath the company buttons in every county, keyed
// by the company name the explore page stores. A company with no entry here
// shows nothing, so adding or retiring a notice is a one-line change.
export const COMPANY_NOTICES = {
  Wellcare: "Wellcare has decided to suppress their plans for 2027.",
  UnitedHealthcare:
    "Please note: UnitedHealthcare plans are not in-network with Samaritan Health Services or Providence Health Services for 2027.",
}

export const companyNotice = (companyName) =>
  COMPANY_NOTICES[companyName] ?? null

// Carriers whose plan cards are withheld in every county. The company button
// and its COMPANY_NOTICES message still render, so a visitor sees the carrier
// and the reason rather than an empty list or a "still adding plans" message.
// Nothing is deleted -- clearing this list brings the plans straight back.
export const COMPANIES_WITH_PLANS_HIDDEN = ["Wellcare"]

export const arePlansHidden = (companyName) =>
  COMPANIES_WITH_PLANS_HIDDEN.includes(companyName)
