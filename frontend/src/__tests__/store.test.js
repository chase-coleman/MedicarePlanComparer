import { describe, it, expect } from "vitest";
import store, { makeStore, rootReducer } from "../store";
import { setCounty } from "../features/county/countySlice";
import { addToPlanComparison } from "../features/plans/comparedPlansSlice";
import { makePlan } from "../test/fixtures";

// Every selector used in a component reads one of these keys; a rename that
// misses a component would show up here first.
const EXPECTED_SLICES = [
  "county",
  "errorMsg",
  "companies",
  "selectedCompany",
  "companyPlans",
  "comparedPlans",
  "showContactForm",
  "showRsvpForm",
  "meetingRsvp",
];

describe("store", () => {
  it("wires up every slice the components select from", () => {
    expect(Object.keys(store.getState()).sort()).toEqual(
      [...EXPECTED_SLICES].sort(),
    );
  });

  it("exposes the same reducer map used to build it", () => {
    expect(Object.keys(rootReducer).sort()).toEqual([...EXPECTED_SLICES].sort());
  });

  it("starts from the slices' own initial state", () => {
    expect(makeStore().getState()).toEqual({
      county: { value: "" },
      errorMsg: { value: "" },
      companies: { value: [] },
      selectedCompany: { value: "" },
      companyPlans: { value: [] },
      comparedPlans: { value: [], notice: null },
      showContactForm: { value: false },
      showRsvpForm: { value: false },
      meetingRsvp: { value: {} },
    });
  });

  it("accepts preloaded state for tests", () => {
    const preloaded = makeStore({ county: { value: "Linn" } });

    expect(preloaded.getState().county.value).toBe("Linn");
    expect(preloaded.getState().companies.value).toEqual([]);
  });

  it("hands each store its own state", () => {
    const a = makeStore();
    const b = makeStore();

    a.dispatch(setCounty("Linn"));

    expect(a.getState().county.value).toBe("Linn");
    expect(b.getState().county.value).toBe("");
  });

  it("routes dispatched actions to the right slice", () => {
    const testStore = makeStore();
    const plan = makePlan({ id: 1 });

    testStore.dispatch(addToPlanComparison(plan));

    expect(testStore.getState().comparedPlans.value).toEqual([plan]);
    expect(testStore.getState().companyPlans.value).toEqual([]);
  });
});
