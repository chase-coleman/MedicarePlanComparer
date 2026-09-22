import { describe, it, expect } from "vitest";
import { API_URL } from "../constants/api";
import { ALL_COUNTIES } from "../constants/counties";
import {
  AFFILIATION_DISCLAIMER,
  COUNTY_DISCLAIMERS,
  countyDisclaimer,
  CURRENT_INFO_DISCLAIMER,
  JMCOLE_DISCLAIMER,
  LINCOLN_CO_DISCLAIMER,
  LINN_CO_DISCLAIMER,
  PLAN_OFFERING_DISCLAIMER,
  TILLAMOOK_CO_DISCLAIMER,
  TRADEMARK,
  TRADEMARK_NOTICE,
} from "../constants/disclaimers";
import { PLAN_YEARS } from "../constants/planYears";

describe("PLAN_YEARS", () => {
  it("lists the years the plan-year toggle offers", () => {
    expect(PLAN_YEARS).toEqual(["2026", "2027"]);
  });

  it("keeps years as strings so they match the keys groupPlansByYear builds", () => {
    expect(PLAN_YEARS.every((year) => typeof year === "string")).toBe(true);
  });

  it("is in ascending order", () => {
    expect([...PLAN_YEARS].sort()).toEqual(PLAN_YEARS);
  });
});

describe("ALL_COUNTIES", () => {
  it("lists the counties the explore page offers", () => {
    expect(ALL_COUNTIES.map((county) => county.countyName)).toEqual([
      "Linn",
      "Tillamook",
      "Lincoln",
      "Clatsop",
      "Lane",
      "Yamhill",
    ]);
  });

  it("carries the database id for every county", () => {
    expect(ALL_COUNTIES.map((county) => county.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("gives every county a disclaimer, its own or the generic fallback", () => {
    for (const { countyName } of ALL_COUNTIES) {
      expect(countyDisclaimer(countyName).trim().length).toBeGreaterThan(0);
    }
  });

  it("names the county in every county-specific disclaimer", () => {
    for (const [countyName, text] of Object.entries(COUNTY_DISCLAIMERS)) {
      expect(text).toContain(`In ${countyName} County`);
    }
  });
});

describe("countyDisclaimer", () => {
  it("returns the county's own disclaimer when it has one", () => {
    expect(countyDisclaimer("Linn")).toBe(LINN_CO_DISCLAIMER);
    expect(countyDisclaimer("Lincoln")).toBe(LINCOLN_CO_DISCLAIMER);
    expect(countyDisclaimer("Tillamook")).toBe(TILLAMOOK_CO_DISCLAIMER);
  });

  it("falls back to the generic disclaimer for a county without one", () => {
    // Clatsop, Lane, and Yamhill ship before their organization and product
    // counts are known, so the footer must still carry the generic notice.
    for (const countyName of ["Clatsop", "Lane", "Yamhill"]) {
      expect(countyDisclaimer(countyName)).toBe(PLAN_OFFERING_DISCLAIMER);
    }
  });

  it("falls back for an unknown county and for no county at all", () => {
    expect(countyDisclaimer("Benton")).toBe(PLAN_OFFERING_DISCLAIMER);
    expect(countyDisclaimer("")).toBe(PLAN_OFFERING_DISCLAIMER);
    expect(countyDisclaimer(undefined)).toBe(PLAN_OFFERING_DISCLAIMER);
  });
});

describe("API_URL", () => {
  it("comes from the Vite environment", () => {
    expect(API_URL).toBe("https://api.test.local/");
  });

  it("ends in a slash, since callers append paths directly to it", () => {
    expect(API_URL.endsWith("/")).toBe(true);
  });
});

describe("disclaimers", () => {
  const required = {
    AFFILIATION_DISCLAIMER,
    CURRENT_INFO_DISCLAIMER,
    LINN_CO_DISCLAIMER,
    LINCOLN_CO_DISCLAIMER,
    TILLAMOOK_CO_DISCLAIMER,
    PLAN_OFFERING_DISCLAIMER,
    JMCOLE_DISCLAIMER,
  };

  it.each(Object.entries(required))("%s is non-empty text", (_name, text) => {
    expect(typeof text).toBe("string");
    expect(text.trim().length).toBeGreaterThan(0);
  });

  it("states the CMS-required non-affiliation language", () => {
    expect(AFFILIATION_DISCLAIMER).toMatch(
      /not connected with or endorsed by the United States government/i,
    );
  });

  it("points every county disclaimer at 1-800-MEDICARE and SHIP", () => {
    for (const text of [
      LINN_CO_DISCLAIMER,
      LINCOLN_CO_DISCLAIMER,
      TILLAMOOK_CO_DISCLAIMER,
      PLAN_OFFERING_DISCLAIMER,
    ]) {
      expect(text).toContain("1-800-MEDICARE");
      expect(text).toContain("State Health Insurance Assistance Program");
    }
  });

  it("keeps the generic plan-offering disclaimer county-agnostic", () => {
    for (const { countyName } of ALL_COUNTIES) {
      expect(PLAN_OFFERING_DISCLAIMER).not.toContain(countyName);
    }
  });

  it("carries the non-discrimination and language-assistance notice", () => {
    expect(JMCOLE_DISCLAIMER).toMatch(/does not discriminate/i);
    expect(JMCOLE_DISCLAIMER).toMatch(/language assistance services/i);
  });
});

describe("trademark", () => {
  it("renders the current year in the copyright line", () => {
    expect(TRADEMARK_NOTICE).toBe(
      `© ${new Date().getFullYear()} ${TRADEMARK}. All rights reserved.`,
    );
  });

  it("names the company", () => {
    expect(TRADEMARK).toContain("JMColegroup");
  });
});
