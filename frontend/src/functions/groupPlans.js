// Each plan-year is its own record from the API. Rows sharing a planGroupId
// are the same plan in different years, so the UI folds them into one card
// with a year toggle.

// Falls back to the row's own id when planGroupId is absent (older API), so
// every plan becomes its own group rather than all of them collapsing into one.
const groupKeyOf = (plan) => plan.planGroupId ?? `id:${plan.id}`;

export const groupPlansByYear = (plans = []) => {
  const groups = new Map();

  for (const plan of plans) {
    const key = groupKeyOf(plan);
    if (!groups.has(key)) {
      groups.set(key, { key, byYear: new Map(), rows: [] });
    }
    const group = groups.get(key);
    group.byYear.set(String(plan.planYear), plan);
    group.rows.push(plan);
  }

  return [...groups.values()].map((group) => {
    const years = [...group.byYear.keys()].sort();
    // Describe the group using its earliest year, so a card keeps a stable
    // name and company even when the selected year has no record.
    const primary = group.byYear.get(years[0]) ?? group.rows[0];
    return {
      key: group.key,
      years,
      byYear: group.byYear,
      primary,
      planName: primary.planName,
      cmsPlanId: primary.cmsPlanId ?? null,
    };
  });
};

export default groupPlansByYear;
