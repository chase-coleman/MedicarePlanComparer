import { describe, it, expect } from "vitest";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders, screen } from "../test/utils";
import App from "../App";
import {
  AFFILIATION_DISCLAIMER,
  CURRENT_INFO_DISCLAIMER,
  JMCOLE_DISCLAIMER,
  LINCOLN_CO_DISCLAIMER,
  LINN_CO_DISCLAIMER,
  PLAN_OFFERING_DISCLAIMER,
  TILLAMOOK_CO_DISCLAIMER,
  TRADEMARK_NOTICE,
} from "../data/constants";

// App renders an <Outlet/>, so it needs a route tree around it.
const renderApp = (options) =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<p>Landing content</p>} />
      </Route>
    </Routes>,
    options,
  );

describe("App", () => {
  it("frames the routed page with the navbar and footer", () => {
    renderApp();

    expect(screen.getByRole("button", { name: "Request a call" })).toBeInTheDocument();
    expect(screen.getByText("Landing content")).toBeInTheDocument();
    expect(screen.getByText("Disclaimers")).toBeInTheDocument();
  });

  describe("footer disclaimers", () => {
    it("always shows the affiliation, currency and non-discrimination notices", () => {
      renderApp();

      expect(screen.getByText(AFFILIATION_DISCLAIMER)).toBeInTheDocument();
      expect(screen.getByText(CURRENT_INFO_DISCLAIMER)).toBeInTheDocument();
      expect(screen.getByText(JMCOLE_DISCLAIMER)).toBeInTheDocument();
      expect(screen.getByText(TRADEMARK_NOTICE)).toBeInTheDocument();
    });

    it("shows the generic plan-offering disclaimer before a county is chosen", () => {
      renderApp();

      expect(screen.getByText(PLAN_OFFERING_DISCLAIMER)).toBeInTheDocument();
    });

    it.each([
      ["Linn", LINN_CO_DISCLAIMER],
      ["Lincoln", LINCOLN_CO_DISCLAIMER],
      ["Tillamook", TILLAMOOK_CO_DISCLAIMER],
    ])("swaps in the %s county disclaimer", (county, disclaimer) => {
      renderApp({ preloadedState: { county: { value: county } } });

      expect(screen.getByText(disclaimer)).toBeInTheDocument();
      expect(screen.queryByText(PLAN_OFFERING_DISCLAIMER)).not.toBeInTheDocument();
    });

    it("falls back to the generic disclaimer for an unknown county", () => {
      renderApp({ preloadedState: { county: { value: "Benton" } } });

      expect(screen.getByText(PLAN_OFFERING_DISCLAIMER)).toBeInTheDocument();
    });
  });

  describe("modals", () => {
    it("shows none by default", () => {
      renderApp();

      expect(screen.queryByRole("heading", { name: "Request a call" })).not.toBeInTheDocument();
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("shows the contact form when its slice is open", () => {
      renderApp({ preloadedState: { showContactForm: { value: true } } });

      expect(
        screen.getByRole("heading", { name: "Request a call" }),
      ).toBeInTheDocument();
    });

    it("opens the contact form from the navbar button", async () => {
      const { user } = renderApp();

      await user.click(screen.getByRole("button", { name: "Request a call" }));

      expect(
        screen.getByRole("heading", { name: "Request a call" }),
      ).toBeInTheDocument();
    });

    it("shows the RSVP form when its slice is open", () => {
      renderApp({ preloadedState: { showRsvpForm: { value: true } } });

      expect(
        screen.getByRole("heading", { name: "RSVP for this meeting" }),
      ).toBeInTheDocument();
    });

    it("shows both forms if both slices are open", () => {
      renderApp({
        preloadedState: {
          showContactForm: { value: true },
          showRsvpForm: { value: true },
        },
      });

      expect(screen.getByRole("heading", { name: "Request a call" })).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "RSVP for this meeting" }),
      ).toBeInTheDocument();
    });

    describe("comparison notice", () => {
      const withNotice = {
        comparedPlans: {
          value: [],
          notice: { type: "limit", title: "Too many", msg: "Only 3 allowed" },
        },
      };

      it("shows the notice when the comparison slice sets one", () => {
        renderApp({ preloadedState: withNotice });

        expect(screen.getByRole("alertdialog", { name: "Too many" })).toBeInTheDocument();
      });

      it("clears the notice when the backdrop is clicked", async () => {
        const { store, user } = renderApp({ preloadedState: withNotice });

        await user.click(document.querySelector(".modal-backdrop"));

        expect(store.getState().comparedPlans.notice).toBeNull();
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });

      it("leaves the contact form's backdrop inert", async () => {
        const { store, user } = renderApp({
          preloadedState: { showContactForm: { value: true } },
        });

        await user.click(document.querySelector(".modal-backdrop"));

        expect(store.getState().showContactForm.value).toBe(true);
      });
    });
  });
});
