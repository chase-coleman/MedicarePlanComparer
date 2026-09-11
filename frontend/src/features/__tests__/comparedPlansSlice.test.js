import { describe, it, expect } from "vitest";
import reducer, {
  MAX_COMPARED_PLANS,
  addToPlanComparison,
  clearNotice,
  removeFromPlanComparison,
  setComparedPlans,
} from "../plans/comparedPlansSlice";
import { makePlan } from "../../test/fixtures";

const initial = { value: [], notice: null };

// Build a state holding `count` distinct plans.
const stateWith = (count) => ({
  value: Array.from({ length: count }, (_, i) => makePlan({ id: i + 1 })),
  notice: null,
});

describe("comparedPlansSlice", () => {
  it("starts empty with no notice", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  it("caps the comparison at three plans", () => {
    expect(MAX_COMPARED_PLANS).toBe(3);
  });

  describe("addToPlanComparison", () => {
    it("adds a plan and clears any standing notice", () => {
      const plan = makePlan({ id: 1 });
      const state = reducer(
        { value: [], notice: { type: "duplicate", title: "t", msg: "m" } },
        addToPlanComparison(plan),
      );

      expect(state.value).toEqual([plan]);
      expect(state.notice).toBeNull();
    });

    it("appends to the end so selection order is preserved", () => {
      let state = reducer(initial, addToPlanComparison(makePlan({ id: 1 })));
      state = reducer(state, addToPlanComparison(makePlan({ id: 2 })));

      expect(state.value.map((plan) => plan.id)).toEqual([1, 2]);
    });

    it("raises a duplicate notice instead of adding the same plan twice", () => {
      const plan = makePlan({ id: 1 });
      let state = reducer(initial, addToPlanComparison(plan));
      state = reducer(state, addToPlanComparison(plan));

      expect(state.value).toHaveLength(1);
      expect(state.notice).toEqual({
        type: "duplicate",
        title: "Plan already added",
        msg: "Plan is already selected to compare",
      });
    });

    it("treats a re-fetched copy of the same plan as a duplicate", () => {
      const state = reducer(
        { value: [makePlan({ id: 1, planName: "A" })], notice: null },
        addToPlanComparison(makePlan({ id: 1, planName: "A (refetched)" })),
      );

      expect(state.value).toHaveLength(1);
      expect(state.notice.type).toBe("duplicate");
    });

    it("raises a limit notice once the cap is reached", () => {
      const state = reducer(
        stateWith(MAX_COMPARED_PLANS),
        addToPlanComparison(makePlan({ id: 99 })),
      );

      expect(state.value).toHaveLength(MAX_COMPARED_PLANS);
      expect(state.notice).toEqual({
        type: "limit",
        title: `You can compare up to ${MAX_COMPARED_PLANS} plans`,
        msg: `Only ${MAX_COMPARED_PLANS} plans can be compared at once.`,
      });
    });

    it("checks for duplicates before the cap", () => {
      const full = stateWith(MAX_COMPARED_PLANS);
      const state = reducer(full, addToPlanComparison(full.value[0]));

      expect(state.notice.type).toBe("duplicate");
    });

    it("accepts a plan again after one is removed to make room", () => {
      let state = stateWith(MAX_COMPARED_PLANS);
      state = reducer(state, removeFromPlanComparison(state.value[0]));
      state = reducer(state, addToPlanComparison(makePlan({ id: 99 })));

      expect(state.value.map((plan) => plan.id)).toEqual([2, 3, 99]);
      expect(state.notice).toBeNull();
    });
  });

  describe("removeFromPlanComparison", () => {
    it("removes the matching plan and leaves the rest in order", () => {
      const state = reducer(
        stateWith(3),
        removeFromPlanComparison(makePlan({ id: 2 })),
      );

      expect(state.value.map((plan) => plan.id)).toEqual([1, 3]);
    });

    it("is a no-op for a plan that was never added", () => {
      const before = stateWith(2);
      const state = reducer(before, removeFromPlanComparison(makePlan({ id: 42 })));

      expect(state.value.map((plan) => plan.id)).toEqual([1, 2]);
    });

    it("leaves an existing notice alone", () => {
      const state = reducer(
        { ...stateWith(1), notice: { type: "limit", title: "t", msg: "m" } },
        removeFromPlanComparison(makePlan({ id: 1 })),
      );

      expect(state.value).toEqual([]);
      expect(state.notice).not.toBeNull();
    });
  });

  describe("setComparedPlans", () => {
    it("empties the comparison", () => {
      const state = reducer(stateWith(3), setComparedPlans());

      expect(state.value).toEqual([]);
    });

    it("ignores any payload it is handed", () => {
      const state = reducer(stateWith(1), setComparedPlans([makePlan({ id: 9 })]));

      expect(state.value).toEqual([]);
    });
  });

  describe("clearNotice", () => {
    it("drops the notice without touching the selection", () => {
      const state = reducer(
        { ...stateWith(2), notice: { type: "limit", title: "t", msg: "m" } },
        clearNotice(),
      );

      expect(state.notice).toBeNull();
      expect(state.value).toHaveLength(2);
    });

    it("is safe when there is no notice", () => {
      expect(reducer(initial, clearNotice())).toEqual(initial);
    });
  });

  it("does not mutate the previous state object", () => {
    const before = stateWith(1);
    const snapshot = structuredClone(before);

    reducer(before, addToPlanComparison(makePlan({ id: 2 })));

    expect(before).toEqual(snapshot);
  });
});
