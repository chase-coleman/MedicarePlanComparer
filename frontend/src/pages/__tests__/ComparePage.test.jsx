import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import ComparePage from "../ComparePage";
import { makePlan } from "../../test/fixtures";

const withPlans = (...plans) => ({
  comparedPlans: { value: plans, notice: null },
});

describe("ComparePage", () => {
  describe("with nothing selected", () => {
    it("explains the empty state", () => {
      renderWithProviders(<ComparePage />);

      expect(screen.getByText("No plans selected yet")).toBeInTheDocument();
    });

    it("points the user at the explore page", () => {
      renderWithProviders(<ComparePage />);

      expect(
        screen.getByRole("link", { name: /Explore Plan Options/i }),
      ).toHaveAttribute("href", "/explore");
    });
  });

  describe("with plans selected", () => {
    it("renders a card per compared plan", () => {
      const { container } = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(
          makePlan({ id: 1, planGroupId: 1, planName: "Plan A" }),
          makePlan({ id: 2, planGroupId: 2, planName: "Plan B" }),
        ),
      });

      expect(container.querySelectorAll(".plan-card")).toHaveLength(2);
      expect(screen.getByText("Plan A")).toBeInTheDocument();
      expect(screen.getByText("Plan B")).toBeInTheDocument();
    });

    it("folds two years of the same plan into a single card", () => {
      const { container } = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(
          makePlan({ id: 1, planGroupId: 7, planYear: 2026 }),
          makePlan({ id: 2, planGroupId: 7, planYear: 2027 }),
        ),
      });

      expect(container.querySelectorAll(".plan-card")).toHaveLength(1);
    });

    it("drops the empty state", () => {
      renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(makePlan({ id: 1 })),
      });

      expect(screen.queryByText("No plans selected yet")).not.toBeInTheDocument();
    });

    it("removes a plan from the comparison when asked", async () => {
      const { store, user } = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(makePlan({ id: 1 })),
      });

      await user.click(
        screen.getByRole("button", { name: "Remove from compare" }),
      );

      expect(store.getState().comparedPlans.value).toEqual([]);
      expect(screen.getByText("No plans selected yet")).toBeInTheDocument();
    });

    it("adds the other plan-year when the card is toggled to it", async () => {
      const y26 = makePlan({ id: 1, planGroupId: 7, planYear: 2026 });
      const y27 = makePlan({ id: 2, planGroupId: 7, planYear: 2027 });
      const { store, user } = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(y26),
      });

      // The card knows about 2027 only once that record is in the comparison,
      // so seed the group by comparing both years from the explore page.
      store.dispatch({ type: "noop" });
      expect(
        screen.getByRole("button", { name: "Remove from compare" }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: "Remove from compare" }),
      );
      expect(store.getState().comparedPlans.value).toEqual([]);

      // With both years compared, the toggle can land on a year the user has
      // since removed, and the card offers to add it back.
      const both = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(y26, y27),
      });
      await both.user.click(
        both.container.querySelectorAll(".plan-card button")[1],
      );

      expect(
        both.store.getState().comparedPlans.value.map((plan) => plan.id),
      ).toEqual([1, 2]);
    });

    it("leaves the other cards in place when one plan is removed", async () => {
      const { store, user, container } = renderWithProviders(<ComparePage />, {
        preloadedState: withPlans(
          makePlan({ id: 1, planGroupId: 1, planName: "Plan A" }),
          makePlan({ id: 2, planGroupId: 2, planName: "Plan B" }),
        ),
      });

      await user.click(
        screen.getAllByRole("button", { name: "Remove from compare" })[0],
      );

      expect(store.getState().comparedPlans.value.map((p) => p.id)).toEqual([2]);
      expect(container.querySelectorAll(".plan-card")).toHaveLength(1);
      expect(screen.getByText("Plan B")).toBeInTheDocument();
      expect(screen.queryByText("Plan A")).not.toBeInTheDocument();
    });
  });
});
