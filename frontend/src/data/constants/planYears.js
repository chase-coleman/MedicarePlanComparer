// Plan years the site carries, used by the plan-year toggle.

export const PLAN_YEARS = ["2026", "2027"]

// The year CMS has not finished publishing. A plan with no record for this
// year keeps its toggle option, which renders the "not available until
// October 1st" message. A missing earlier year means the site never carried
// the plan that year, so PlanComponent drops that option instead.
export const UPCOMING_PLAN_YEAR = PLAN_YEARS[PLAN_YEARS.length - 1]
