import { describe, it, expect } from "vitest";
import { BROKERS } from "../brokers";

describe("BROKERS", () => {
  it("lists every broker shown on the landing page", () => {
    expect(BROKERS).toHaveLength(5);
  });

  it("gives each broker the exact fields EmployeeCard renders", () => {
    for (const broker of BROKERS) {
      expect(Object.keys(broker).sort()).toEqual([
        "broker",
        "email",
        "imgSource",
        "npn",
        "phone",
      ]);
    }
  });

  it.each(BROKERS.map((broker) => [broker.broker, broker]))(
    "%s has usable contact details",
    (_name, broker) => {
      expect(broker.broker.trim()).toBe(broker.broker);
      expect(broker.broker).not.toBe("");
      expect(broker.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
      // EmployeeCard builds a tel: href from this, so it must hold 10 digits.
      expect(broker.phone.replace(/\D/g, "")).toHaveLength(10);
      // NPNs are numeric; JJ Peters has none on file yet, which renders blank.
      expect(broker.npn).toMatch(/^\d*$/);
    },
  );

  it("points every photo at a public asset path", () => {
    for (const broker of BROKERS) {
      expect(broker.imgSource).toMatch(/^\/[\w-]+\.(jpg|jpeg|png|webp)$/);
    }
  });

  it("has no duplicate brokers, phone numbers, or emails", () => {
    const unique = (key) => new Set(BROKERS.map((broker) => broker[key])).size;

    expect(unique("broker")).toBe(BROKERS.length);
    expect(unique("phone")).toBe(BROKERS.length);
    expect(unique("email")).toBe(BROKERS.length);
    // LandingPage keys the card list by broker name.
    expect(unique("imgSource")).toBe(BROKERS.length);
  });
});
