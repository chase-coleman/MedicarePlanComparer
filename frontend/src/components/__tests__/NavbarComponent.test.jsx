import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, within } from "../../test/utils";
import NavbarComponent from "../NavbarComponent";

const DESKTOP_LINKS = [
  ["Home", "/"],
  ["Find A Meeting", "/find-meeting"],
  ["Explore Plan Options", "/explore"],
  ["Compare Plans", "/compare"],
];

describe("NavbarComponent", () => {
  it("shows the brand", () => {
    renderWithProviders(<NavbarComponent />);

    expect(screen.getAllByText("MPRC").length).toBeGreaterThan(0);
  });

  it.each(DESKTOP_LINKS)("links %s to %s", (label, href) => {
    renderWithProviders(<NavbarComponent />);

    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
  });

  it("marks the current route as active", () => {
    renderWithProviders(<NavbarComponent />, { route: "/explore" });

    expect(screen.getByRole("link", { name: "Explore Plan Options" })).toHaveClass(
      "nav-link-active",
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass(
      "nav-link-active",
    );
  });

  it("points both wordmarks at the home route", () => {
    renderWithProviders(<NavbarComponent />);

    const brands = screen.getAllByRole("link", { name: /^MPRC/ });
    expect(brands.length).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(brand).toHaveAttribute("href", "/");
    }
  });

  it("marks Home active on the landing route", () => {
    renderWithProviders(<NavbarComponent />, { route: "/" });

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
      "nav-link-active",
    );
  });

  it("opens the contact form from the Request a call button", async () => {
    const { store, user } = renderWithProviders(<NavbarComponent />);

    expect(store.getState().showContactForm.value).toBe(false);

    await user.click(screen.getByRole("button", { name: "Request a call" }));

    expect(store.getState().showContactForm.value).toBe(true);
  });

  describe("mobile menu", () => {
    it("starts closed", () => {
      renderWithProviders(<NavbarComponent />);

      expect(
        screen.getByRole("button", { name: "Open menu" }),
      ).toBeInTheDocument();
    });

    it("opens on the toggle and lists every page", async () => {
      const { user } = renderWithProviders(<NavbarComponent />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(
        screen.getByRole("button", { name: "Close menu" }),
      ).toBeInTheDocument();

      const menu = document.querySelector(".nav-menu-sheet");
      for (const [label, href] of [
        ["Home", "/"],
        ["Explore plan options", "/explore"],
        ["Compare Plans", "/compare"],
        ["Find A Meeting", "/find-meeting"],
      ]) {
        expect(within(menu).getByRole("link", { name: label })).toHaveAttribute(
          "href",
          href,
        );
      }
    });

    it("closes the menu when the wordmark is used to go home", async () => {
      const { user } = renderWithProviders(<NavbarComponent />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      const [mobileBrand] = screen.getAllByRole("link", { name: /^MPRC/ });
      await user.click(mobileBrand);

      expect(
        screen.getByRole("button", { name: "Open menu" }),
      ).toBeInTheDocument();
    });

    it("puts Home at the top of the menu", async () => {
      const { user } = renderWithProviders(<NavbarComponent />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));

      const menu = document.querySelector(".nav-menu-sheet");
      expect(
        within(menu)
          .getAllByRole("link")
          .map((link) => link.textContent),
      ).toEqual([
        "Home",
        "Explore plan options",
        "Compare Plans",
        "Find A Meeting",
      ]);
    });

    it("closes again when a menu link is followed", async () => {
      const { user } = renderWithProviders(<NavbarComponent />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      const menu = document.querySelector(".nav-menu-sheet");
      await user.click(within(menu).getByRole("link", { name: "Compare Plans" }));

      expect(
        screen.getByRole("button", { name: "Open menu" }),
      ).toBeInTheDocument();
    });

    it("closes on a second press of the toggle", async () => {
      const { user } = renderWithProviders(<NavbarComponent />);

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      await user.click(screen.getByRole("button", { name: "Close menu" }));

      expect(
        screen.getByRole("button", { name: "Open menu" }),
      ).toBeInTheDocument();
    });
  });
});
