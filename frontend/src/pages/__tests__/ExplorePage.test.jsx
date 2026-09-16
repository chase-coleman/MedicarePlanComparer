import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { renderWithProviders, screen, waitFor } from "../../test/utils";
import ExplorePage from "../ExplorePage";
import { makeCompany, makePlan } from "../../test/fixtures";

vi.mock("axios");

const API = "https://api.test.local/";

const companies = [
  makeCompany({ id: 1, companyName: "Devoted" }),
  makeCompany({ id: 2, companyName: "PacificSource" }),
];

// The page calls `${API}${county}` for companies and `${API}${county}/${company}`
// for plans, so the extra path segment tells the two requests apart.
const isPlansRequest = (url) => url.replace(API, "").includes("/");

const respondWith = ({ companyList = companies, plans = [] } = {}) => {
  axios.get.mockImplementation((url) =>
    Promise.resolve({ data: isPlansRequest(url) ? plans : companyList }),
  );
};

describe("ExplorePage", () => {
  beforeEach(() => {
    respondWith();
  });

  it("asks the user to pick a county first", () => {
    renderWithProviders(<ExplorePage />);

    expect(screen.getByText("Select your county:")).toBeInTheDocument();
    for (const county of ["Linn", "Tillamook", "Lincoln", "Clatsop", "Lane", "Yamhill"]) {
      expect(screen.getByRole("button", { name: county })).toBeInTheDocument();
    }
  });

  it("does not fetch anything before a county is chosen", () => {
    renderWithProviders(<ExplorePage />);

    expect(axios.get).not.toHaveBeenCalled();
  });

  it("hides the company prompt until a county is chosen", () => {
    renderWithProviders(<ExplorePage />);

    expect(screen.queryByText(/Select a company/)).not.toBeInTheDocument();
  });

  describe("a county with nothing in it yet", () => {
    it("says so instead of showing an empty company row", async () => {
      respondWith({ companyList: [] });
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Clatsop" }));

      await waitFor(() =>
        expect(
          screen.getByText(/do not have any plans to show in Clatsop county/i),
        ).toBeInTheDocument(),
      );
      expect(screen.queryByText(/Select a company/)).not.toBeInTheDocument();
    });

    it("keeps the message off screen until the company fetch comes back", async () => {
      let release;
      axios.get.mockImplementation(
        () => new Promise((resolve) => { release = () => resolve({ data: [] }); }),
      );
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Lane" }));

      expect(
        screen.queryByText(/do not have any plans to show/i),
      ).not.toBeInTheDocument();

      release();
      await waitFor(() =>
        expect(
          screen.getByText(/do not have any plans to show in Lane county/i),
        ).toBeInTheDocument(),
      );
    });

    it("drops the previous county's companies when a new county is picked", async () => {
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Linn" }));
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Devoted" })).toBeInTheDocument(),
      );

      respondWith({ companyList: [] });
      await user.click(screen.getByRole("button", { name: "Yamhill" }));

      await waitFor(() =>
        expect(
          screen.queryByRole("button", { name: "Devoted" }),
        ).not.toBeInTheDocument(),
      );
    });

    it("says so when a company has no plans in the selected county", async () => {
      respondWith({ plans: [] });
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Yamhill" }));
      await user.click(
        await screen.findByRole("button", { name: "Devoted" }),
      );

      await waitFor(() =>
        expect(
          screen.getByText(/do not have any Devoted plans to show in Yamhill/i),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("choosing a county", () => {
    it("stores the county and fetches its companies", async () => {
      const { store, user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Linn" }));

      expect(store.getState().county.value).toBe("Linn");
      await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${API}Linn`));
    });

    it("lists the companies that came back", async () => {
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Linn" }));

      expect(
        await screen.findByRole("button", { name: "Devoted" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "PacificSource" }),
      ).toBeInTheDocument();
    });

    it("prompts for a company once the county is known", async () => {
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Tillamook" }));

      expect(
        await screen.findByText(
          "Select a company to view their plans in Tillamook county:",
        ),
      ).toBeInTheDocument();
    });

    it("marks the chosen county as active", async () => {
      const { user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Lincoln" }));

      expect(screen.getByRole("button", { name: "Lincoln" })).toHaveClass(
        "btn-pill-active",
      );
      expect(screen.getByRole("button", { name: "Linn" })).toHaveClass(
        "btn-pill",
      );
    });

    it("clears the previous company and its plans", async () => {
      const { store, user } = renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Devoted" },
          companyPlans: { value: [makePlan({ id: 1 })] },
        },
      });

      await user.click(screen.getByRole("button", { name: "Tillamook" }));

      expect(store.getState().selectedCompany.value).toBeNull();
      expect(store.getState().companyPlans.value).toEqual([]);
    });

    it("stores a readable message when the company request fails", async () => {
      axios.get.mockRejectedValue({
        response: { status: 500, data: { message: "County lookup failed" } },
      });
      const { store, user } = renderWithProviders(<ExplorePage />);

      await user.click(screen.getByRole("button", { name: "Linn" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe("County lookup failed"),
      );
    });
  });

  describe("choosing a company", () => {
    const plans = [
      makePlan({ id: 1, planGroupId: 1, planName: "Devoted Core" }),
      makePlan({ id: 2, planGroupId: 2, planName: "Devoted Giveback" }),
    ];

    const openCompany = async () => {
      respondWith({ plans });
      const rendered = renderWithProviders(<ExplorePage />, {
        preloadedState: { county: { value: "Linn" } },
      });
      await rendered.user.click(
        await screen.findByRole("button", { name: "Devoted" }),
      );
      return rendered;
    };

    it("fetches that company's plans for the selected county", async () => {
      const { store } = await openCompany();

      expect(store.getState().selectedCompany.value).toBe("Devoted");
      await waitFor(() =>
        expect(axios.get).toHaveBeenCalledWith(`${API}Linn/Devoted`),
      );
    });

    it("renders a card per plan", async () => {
      const { container } = await openCompany();

      expect(await screen.findByText("Devoted Core")).toBeInTheDocument();
      expect(screen.getByText("Devoted Giveback")).toBeInTheDocument();
      await waitFor(() =>
        expect(container.querySelectorAll(".plan-card")).toHaveLength(2),
      );
    });

    it("explains that the plans shown are highlights only", async () => {
      await openCompany();

      expect(
        await screen.findByText(/The plans displayed are/),
      ).toBeInTheDocument();
    });

    it("marks the chosen company as active", async () => {
      await openCompany();

      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Devoted" })).toHaveClass(
          "btn-pill-active",
        ),
      );
      expect(screen.getByRole("button", { name: "PacificSource" })).toHaveClass(
        "btn-pill",
      );
    });

    it("stores a readable message when the plan request fails", async () => {
      axios.get.mockImplementation((url) =>
        url.endsWith("Devoted")
          ? Promise.reject({ request: {} })
          : Promise.resolve({ data: companies }),
      );
      const { store, user } = renderWithProviders(<ExplorePage />, {
        preloadedState: { county: { value: "Linn" } },
      });

      await user.click(await screen.findByRole("button", { name: "Devoted" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe(
          "No response from server. Please refresh or try again later.",
        ),
      );
    });

    it("shows no highlight hint while the company has no plans", async () => {
      respondWith({ plans: [] });
      const { user } = renderWithProviders(<ExplorePage />, {
        preloadedState: { county: { value: "Linn" } },
      });

      await user.click(await screen.findByRole("button", { name: "Devoted" }));

      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
      expect(screen.queryByText(/The plans displayed are/)).not.toBeInTheDocument();
    });

    it("folds two years of one plan into a single card", async () => {
      respondWith({
        plans: [
          makePlan({ id: 1, planGroupId: 7, planYear: 2026 }),
          makePlan({ id: 2, planGroupId: 7, planYear: 2027 }),
        ],
      });
      const { user, container } = renderWithProviders(<ExplorePage />, {
        preloadedState: { county: { value: "Linn" } },
      });

      await user.click(await screen.findByRole("button", { name: "Devoted" }));

      await waitFor(() =>
        expect(container.querySelectorAll(".plan-card")).toHaveLength(1),
      );
    });
  });

  describe("building a comparison", () => {
    const renderWithPlans = (planList) => {
      respondWith({ plans: planList });
      return renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Devoted" },
          companyPlans: { value: planList },
        },
      });
    };

    it("adds a plan to the comparison", async () => {
      const plan = makePlan({ id: 1 });
      const { store, user } = renderWithPlans([plan]);

      await user.click(
        await screen.findByRole("button", { name: "Add to compare" }),
      );

      expect(store.getState().comparedPlans.value).toEqual([plan]);
    });

    it("takes a plan back out of the comparison", async () => {
      const plan = makePlan({ id: 1 });
      const { store, user } = renderWithPlans([plan]);

      await user.click(
        await screen.findByRole("button", { name: "Add to compare" }),
      );
      await user.click(
        await screen.findByRole("button", { name: "Remove from compare" }),
      );

      expect(store.getState().comparedPlans.value).toEqual([]);
    });

    it("raises a notice when a fourth plan is added", async () => {
      const plans = [1, 2, 3, 4].map((id) =>
        makePlan({ id, planGroupId: id, planName: `Plan ${id}` }),
      );
      const { store, user } = renderWithPlans(plans);

      for (const button of await screen.findAllByRole("button", {
        name: "Add to compare",
      })) {
        await user.click(button);
      }

      expect(store.getState().comparedPlans.value).toHaveLength(3);
      expect(store.getState().comparedPlans.notice).toMatchObject({
        type: "limit",
      });
    });
  });
});
