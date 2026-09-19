import { describe, it, expect, vi } from "vitest";
import { resetScrollOnReload } from "../scrollRestoration";

const fakeWindow = (overrides = {}) => ({
  history: { scrollRestoration: "auto" },
  scrollTo: vi.fn(),
  ...overrides,
});

describe("resetScrollOnReload", () => {
  it("takes scroll restoration away from the browser", () => {
    const win = fakeWindow();

    resetScrollOnReload(win);

    expect(win.history.scrollRestoration).toBe("manual");
  });

  it("scrolls to the top, for browsers that already restored the position", () => {
    const win = fakeWindow();

    resetScrollOnReload(win);

    expect(win.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("still scrolls up where scrollRestoration is unsupported", () => {
    const win = fakeWindow({ history: {} });

    expect(() => resetScrollOnReload(win)).not.toThrow();
    expect(win.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("does nothing harmful without a window", () => {
    expect(() => resetScrollOnReload(undefined)).not.toThrow();
  });
});
