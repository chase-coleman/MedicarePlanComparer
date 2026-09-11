import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import LandingPage from "../LandingPage";
import { BROKERS } from "../../data/brokers";

describe("LandingPage", () => {
  it("leads with the enrollment headline", () => {
    renderWithProviders(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: "Explore Medicare plans in your area today",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Medicare Annual Enrollment begins October 15"),
    ).toBeInTheDocument();
  });

  it("opens the contact form from the call-to-action", async () => {
    const { store, user } = renderWithProviders(<LandingPage />);

    await user.click(screen.getByRole("button", { name: "Request a call" }));

    expect(store.getState().showContactForm.value).toBe(true);
  });

  it("links to the meeting finder", () => {
    renderWithProviders(<LandingPage />);

    expect(
      screen.getByRole("link", { name: /Find a Medicare meeting/i }),
    ).toHaveAttribute("href", "/find-meeting");
  });

  it("lists the walk-in kiosk hours", () => {
    renderWithProviders(<LandingPage />);

    expect(
      screen.getByText("Find us during the Annual Enrollment Period"),
    ).toBeInTheDocument();
    expect(screen.getByText("Newport Walmart Kiosk")).toBeInTheDocument();
    expect(screen.getByText("Lebanon Walmart Kiosk")).toBeInTheDocument();
  });

  it("describes the company", () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByText("About JMCole Group")).toBeInTheDocument();
    expect(
      screen.getByText(/part of the Medicare Plans Resource\s+Center/),
    ).toBeInTheDocument();
  });

  describe("broker cards", () => {
    it("renders one card per broker in the data file", () => {
      const { container } = renderWithProviders(<LandingPage />);

      expect(container.querySelectorAll(".broker-card")).toHaveLength(
        BROKERS.length,
      );
    });

    it.each(BROKERS.map((broker) => [broker.broker, broker]))(
      "shows %s with their photo, phone and email",
      (name, broker) => {
        renderWithProviders(<LandingPage />);

        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByAltText(name)).toHaveAttribute(
          "src",
          broker.imgSource,
        );
        expect(
          screen.getByRole("link", { name: broker.phone }),
        ).toBeInTheDocument();
        expect(screen.getByText(broker.email)).toBeInTheDocument();
      },
    );

    it("keeps the brokers in the order the data file lists them", () => {
      const { container } = renderWithProviders(<LandingPage />);

      const names = [...container.querySelectorAll(".broker-name")].map(
        (node) => node.textContent,
      );

      expect(names).toEqual(BROKERS.map((broker) => broker.broker));
    });
  });
});
