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

// Shown at the top of the explore page, above the county buttons. ALL_COUNTIES
// is the whole list the site carries, so a visitor from anywhere else needs to
// be told they are not out of options.
export const UNLISTED_COUNTY_NOTICE =
  "Don't see your county? We can still help. Give us a call, or use the \"Request a Call\" button and one of our agents will reach out."

// Every county in Oregon, for the "Request a call" form. Separate from
// ALL_COUNTIES on purpose: a caller can live anywhere in the state, not just
// where the site lists plans.
export const OREGON_COUNTIES = [
  "Baker", "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Crook",
  "Curry", "Deschutes", "Douglas", "Gilliam", "Grant", "Harney", "Hood River",
  "Jackson", "Jefferson", "Josephine", "Klamath", "Lake", "Lane", "Lincoln",
  "Linn", "Malheur", "Marion", "Morrow", "Multnomah", "Polk", "Sherman",
  "Tillamook", "Umatilla", "Union", "Wallowa", "Wasco", "Washington",
  "Wheeler", "Yamhill",
]

// Last option in the county dropdown, for callers who live out of state.
export const OUTSIDE_OREGON = "Outside Oregon"
