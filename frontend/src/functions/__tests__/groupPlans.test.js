import { describe, it, expect } from "vitest";
import groupPlansByYearDefault, { groupPlansByYear } from "../groupPlans";
import { makePlan } from "../../test/fixtures";

describe("groupPlansByYear", () => {
  it("returns an empty list for no plans", () => {
    expect(groupPlansByYear([])).toEqual([]);
  });

  it("defaults to an empty list when called with no argument", () => {
    expect(groupPlansByYear()).toEqual([]);
  });

  it("exposes the same function as the default export", () => {
    expect(groupPlansByYearDefault).toBe(groupPlansByYear);
  });

  it("folds rows sharing a planGroupId into one group", () => {
    const y26 = makePlan({ id: 1, planGroupId: 7, planYear: 2026 });
    const y27 = makePlan({ id: 2, planGroupId: 7, planYear: 2027 });

    const [group, ...rest] = groupPlansByYear([y26, y27]);

    expect(rest).toHaveLength(0);
    expect(group.key).toBe(7);
    expect(group.years).toEqual(["2026", "2027"]);
    expect(group.byYear.get("2026")).toBe(y26);
    expect(group.byYear.get("2027")).toBe(y27);
  });

  it("keeps plans with different planGroupIds in separate groups", () => {
    const groups = groupPlansByYear([
      makePlan({ id: 1, planGroupId: 7 }),
      makePlan({ id: 2, planGroupId: 8 }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.key)).toEqual([7, 8]);
  });

  it("keys years as strings so they match the PLAN_YEARS constants", () => {
    const [group] = groupPlansByYear([makePlan({ planYear: 2026 })]);

    expect(group.byYear.has("2026")).toBe(true);
    expect(group.byYear.has(2026)).toBe(false);
    expect(group.years.every((year) => typeof year === "string")).toBe(true);
  });

  it("sorts years ascending regardless of input order", () => {
    const [group] = groupPlansByYear([
      makePlan({ id: 2, planGroupId: 7, planYear: 2027 }),
      makePlan({ id: 1, planGroupId: 7, planYear: 2026 }),
    ]);

    expect(group.years).toEqual(["2026", "2027"]);
  });

  it("describes the group with its earliest year", () => {
    const [group] = groupPlansByYear([
      makePlan({
        id: 2,
        planGroupId: 7,
        planYear: 2027,
        planName: "Renamed For 2027",
        cmsPlanId: "H9999-001-000",
      }),
      makePlan({
        id: 1,
        planGroupId: 7,
        planYear: 2026,
        planName: "Original Name",
        cmsPlanId: "H1111-001-000",
      }),
    ]);

    expect(group.planName).toBe("Original Name");
    expect(group.cmsPlanId).toBe("H1111-001-000");
    expect(group.primary.id).toBe(1);
  });

  it("reports a null cmsPlanId rather than undefined when the API omits it", () => {
    const [group] = groupPlansByYear([makePlan({ cmsPlanId: undefined })]);

    expect(group.cmsPlanId).toBeNull();
  });

  describe("when the API predates planGroupId", () => {
    it("gives every row its own group keyed off the row id", () => {
      const groups = groupPlansByYear([
        makePlan({ id: 1, planGroupId: undefined }),
        makePlan({ id: 2, planGroupId: undefined }),
      ]);

      expect(groups).toHaveLength(2);
      expect(groups.map((group) => group.key)).toEqual(["id:1", "id:2"]);
    });

    it("does not collapse rows when planGroupId is null", () => {
      const groups = groupPlansByYear([
        makePlan({ id: 1, planGroupId: null }),
        makePlan({ id: 2, planGroupId: null }),
      ]);

      expect(groups).toHaveLength(2);
    });
  });

  it("keeps the last row when two rows claim the same group and year", () => {
    const first = makePlan({ id: 1, planGroupId: 7, planYear: 2026 });
    const second = makePlan({ id: 2, planGroupId: 7, planYear: 2026 });

    const [group] = groupPlansByYear([first, second]);

    expect(group.years).toEqual(["2026"]);
    expect(group.byYear.get("2026")).toBe(second);
    expect(group.primary).toBe(second);
  });

  it("preserves the order groups were first seen in", () => {
    const groups = groupPlansByYear([
      makePlan({ id: 1, planGroupId: 9 }),
      makePlan({ id: 2, planGroupId: 3 }),
      makePlan({ id: 3, planGroupId: 9, planYear: 2027 }),
    ]);

    expect(groups.map((group) => group.key)).toEqual([9, 3]);
  });

  it("does not mutate the plans it was given", () => {
    const plans = [makePlan({ id: 1 })];
    const snapshot = structuredClone(plans);

    groupPlansByYear(plans);

    expect(plans).toEqual(snapshot);
  });
});
