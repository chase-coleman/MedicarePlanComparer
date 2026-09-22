import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { renderWithProviders, screen, waitFor } from "../../test/utils";
import ExplorePage from "../ExplorePage";
import { makeCompany, makePlan } from "../../test/fixtures";
import { COMPANY_NOTICES } from "../../data/constants/companies";

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
          screen.getByText(/still working at adding plans in Clatsop/i),
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
        screen.queryByText(/still working at adding plans/i),
      ).not.toBeInTheDocument();

      release();
      await waitFor(() =>
        expect(
          screen.getByText(/still working at adding plans in Lane/i),
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
          screen.getByText(/still working at adding Devoted plans in Yamhill/i),
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

  describe("carrier notices", () => {
    it("shows Wellcare's 2027 notice in a county", async () => {
      renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Wellcare" },
        },
      });

      expect(
        await screen.findByText(
          "Wellcare has decided to not promote their plans for 2027.",
        ),
      ).toBeInTheDocument();
    });

    it("withholds the plan cards for a hidden carrier", async () => {
      // Served by the API, so this proves suppression rather than an empty list
      respondWith({ plans: [makePlan({ id: 1, planName: "Wellcare Simple" })] });
      renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Wellcare" },
        },
      });

      await screen.findByText(
        "Wellcare has decided to not promote their plans for 2027.",
      );
      expect(screen.queryByText("Wellcare Simple")).not.toBeInTheDocument();
      // The notice is the explanation, so the empty state must not contradict it
      expect(
        screen.queryByText(/still working at adding/i),
      ).not.toBeInTheDocument();
    });

    it("still shows plans for a carrier that is not hidden", async () => {
      respondWith({ plans: [makePlan({ id: 1, planName: "Devoted Core" })] });
      renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Devoted" },
        },
      });

      expect(await screen.findByText("Devoted Core")).toBeInTheDocument();
    });

    it("stays off for a carrier with no notice", () => {
      renderWithProviders(<ExplorePage />, {
        preloadedState: {
          county: { value: "Linn" },
          selectedCompany: { value: "Devoted" },
          companyPlans: { value: [makePlan({ id: 1 })] },
        },
      });

      expect(
        screen.queryByText(/decided to not promote/i),
      ).not.toBeInTheDocument();
    });

    describe("UnitedHealthcare network notice", () => {
      const notice = COMPANY_NOTICES.UnitedHealthcare;

      it("names Samaritan and Providence as out of network", () => {
        expect(notice).toContain("Samaritan Health Services");
        expect(notice).toContain("Providence Health Services");
      });

      it("shows alongside UnitedHealthcare's plans", async () => {
        respondWith({ plans: [makePlan({ id: 1, planName: "UHC Complete" })] });
        renderWithProviders(<ExplorePage />, {
          preloadedState: {
            county: { value: "Linn" },
            selectedCompany: { value: "UnitedHealthcare" },
          },
        });

        expect(await screen.findByText(notice)).toBeInTheDocument();
        expect(await screen.findByText("UHC Complete")).toBeInTheDocument();
        // Plans are on the page, so no "visit the company's site" follow-up
        expect(
          screen.queryByText(/visit the company's site/i),
        ).not.toBeInTheDocument();
      });

      it("is not shown for other carriers", () => {
        renderWithProviders(<ExplorePage />, {
          preloadedState: {
            county: { value: "Linn" },
            selectedCompany: { value: "Devoted" },
            companyPlans: { value: [makePlan({ id: 1 })] },
          },
        });

        expect(screen.queryByText(/Samaritan/)).not.toBeInTheDocument();
      });
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

    describe("floating compare button", () => {
      it("stays hidden until a plan is added", async () => {
        renderWithPlans([makePlan({ id: 1 })]);

        await screen.findByRole("button", { name: "Add to compare" });

        expect(
          screen.queryByRole("link", { name: /Compare plan/ }),
        ).not.toBeInTheDocument();
      });

      it("appears with a count and links to the compare page", async () => {
        const plans = [1, 2].map((id) =>
          makePlan({ id, planGroupId: id, planName: `Plan ${id}` }),
        );
        const { user } = renderWithPlans(plans);

        const [first, second] = await screen.findAllByRole("button", {
          name: "Add to compare",
        });
        await user.click(first);
        expect(
          screen.getByRole("link", { name: /1 Compare plan/ }),
        ).toHaveAttribute("href", "/compare");

        await user.click(second);
        expect(
          screen.getByRole("link", { name: /2 Compare plans/ }),
        ).toBeInTheDocument();
      });
    });
  });
});
