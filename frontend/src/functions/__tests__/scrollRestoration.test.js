import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import {
  resetScrollOnReload,
  useScrollToTopOnNavigate,
} from "../scrollRestoration";

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

describe("useScrollToTopOnNavigate", () => {
  // Runs the hook inside a router and hands back navigate(), so a test can
  // change routes the way a link click would.
  const renderInRouter = (win) =>
    renderHook(
      () => {
        useScrollToTopOnNavigate(win);
        return useNavigate();
      },
      {
        wrapper: ({ children }) =>
          createElement(MemoryRouter, { initialEntries: ["/explore"] }, children),
      },
    );

  it("scrolls to the top when a page first opens", () => {
    const win = fakeWindow();

    renderInRouter(win);

    expect(win.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it("scrolls to the top again on every route change", () => {
    const win = fakeWindow();
    const { result, rerender } = renderInRouter(win);
    win.scrollTo.mockClear();

    act(() => result.current("/compare"));
    rerender();

    expect(win.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("does nothing harmful without scrollTo", () => {
    expect(() => renderInRouter({})).not.toThrow();
  });
});
