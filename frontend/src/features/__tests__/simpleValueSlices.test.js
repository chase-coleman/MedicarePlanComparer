import { describe, it, expect } from "vitest";
import countyReducer, { setCounty } from "../county/countySlice";
import errorReducer, { setErrorMsg } from "../errors/errorSlice";
import companiesReducer, { setCompanies } from "../companies/companiesSlice";
import selectedCompanyReducer, {
  setSelectedCompany,
} from "../companies/selectedCompanySlice";
import companyPlansReducer, { setPlans } from "../plans/companyPlansSlice";
import { makeCompany, makePlan } from "../../test/fixtures";

const init = (reducer) => reducer(undefined, { type: "@@INIT" });

describe("countySlice", () => {
  it("starts with no county selected", () => {
    expect(init(countyReducer)).toEqual({ value: "" });
  });

  it("stores the selected county", () => {
    expect(countyReducer(undefined, setCounty("Linn"))).toEqual({
      value: "Linn",
    });
  });

  it("replaces a previous selection", () => {
    const state = countyReducer({ value: "Linn" }, setCounty("Tillamook"));

    expect(state.value).toBe("Tillamook");
  });

  it("can be cleared back to an empty string", () => {
    expect(countyReducer({ value: "Linn" }, setCounty("")).value).toBe("");
  });

  it("ignores unrelated actions", () => {
    const before = { value: "Lincoln" };

    expect(countyReducer(before, { type: "other/action" })).toBe(before);
  });
});

describe("errorSlice", () => {
  it("starts with no message", () => {
    expect(init(errorReducer)).toEqual({ value: "" });
  });

  it("stores an error message", () => {
    expect(errorReducer(undefined, setErrorMsg("Server Error: 500")).value).toBe(
      "Server Error: 500",
    );
  });

  it("overwrites the previous message", () => {
    const state = errorReducer({ value: "old" }, setErrorMsg("new"));

    expect(state.value).toBe("new");
  });
});

describe("companiesSlice", () => {
  it("starts with an empty list", () => {
    expect(init(companiesReducer)).toEqual({ value: [] });
  });

  it("stores the companies returned for a county", () => {
    const companies = [makeCompany({ id: 1 }), makeCompany({ id: 2 })];

    expect(companiesReducer(undefined, setCompanies(companies)).value).toEqual(
      companies,
    );
  });

  it("replaces the list rather than appending when the county changes", () => {
    const state = companiesReducer(
      { value: [makeCompany({ id: 1, companyName: "Devoted" })] },
      setCompanies([makeCompany({ id: 2, companyName: "PacificSource" })]),
    );

    expect(state.value).toHaveLength(1);
    expect(state.value[0].companyName).toBe("PacificSource");
  });

  it("can be emptied", () => {
    expect(companiesReducer({ value: [makeCompany()] }, setCompanies([])).value)
      .toEqual([]);
  });
});

describe("selectedCompanySlice", () => {
  it("starts with no company selected", () => {
    expect(init(selectedCompanyReducer)).toEqual({ value: "" });
  });

  it("stores the selected company name", () => {
    expect(
      selectedCompanyReducer(undefined, setSelectedCompany("Devoted")).value,
    ).toBe("Devoted");
  });

  it("accepts the null the explore page uses to clear a selection", () => {
    const state = selectedCompanyReducer(
      { value: "Devoted" },
      setSelectedCompany(null),
    );

    expect(state.value).toBeNull();
  });
});

describe("companyPlansSlice", () => {
  it("starts with an empty list", () => {
    expect(init(companyPlansReducer)).toEqual({ value: [] });
  });

  it("stores the plans returned for a company", () => {
    const plans = [makePlan({ id: 1 }), makePlan({ id: 2 })];

    expect(companyPlansReducer(undefined, setPlans(plans)).value).toEqual(plans);
  });

  it("falls back to an empty list when dispatched with no payload", () => {
    const state = companyPlansReducer({ value: [makePlan()] }, setPlans());

    expect(state.value).toEqual([]);
  });

  it("falls back to an empty list for a null payload", () => {
    const state = companyPlansReducer({ value: [makePlan()] }, setPlans(null));

    expect(state.value).toEqual([]);
  });
});
