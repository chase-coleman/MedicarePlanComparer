import { describe, it, expect } from "vitest";
import {
  AFFILIATION_DISCLAIMER,
  ALL_COUNTIES,
  API_URL,
  CURRENT_INFO_DISCLAIMER,
  JMCOLE_DISCLAIMER,
  LINCOLN_CO_DISCLAIMER,
  LINN_CO_DISCLAIMER,
  PLAN_OFFERING_DISCLAIMER,
  PLAN_YEARS,
  TILLAMOOK_CO_DISCLAIMER,
  TRADEMARK,
  TRADEMARK_NOTICE,
} from "../constants";

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
    ]);
  });

  it("has a county-specific disclaimer for each county", () => {
    const byCounty = {
      Linn: LINN_CO_DISCLAIMER,
      Tillamook: TILLAMOOK_CO_DISCLAIMER,
      Lincoln: LINCOLN_CO_DISCLAIMER,
    };

    for (const { countyName } of ALL_COUNTIES) {
      expect(byCounty[countyName]).toContain(`In ${countyName} County`);
    }
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
