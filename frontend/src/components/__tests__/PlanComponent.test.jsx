import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, within } from "../../test/utils";
import PlanComponent from "../PlanComponent";
import { groupPlansByYear } from "../../functions/groupPlans";
import { makePlan } from "../../test/fixtures";

// Build the prop the page passes down, using the real grouping function so the
// component and its caller cannot drift apart.
const groupOf = (...plans) => groupPlansByYear(plans)[0];

const renderPlan = (group, options = {}) => {
  const addToCompare = vi.fn();
  const removeFromCompare = vi.fn();
  const rendered = renderWithProviders(
    <PlanComponent
      planGroup={group}
      addToCompare={addToCompare}
      removeFromCompare={removeFromCompare}
    />,
    options,
  );
  return { ...rendered, addToCompare, removeFromCompare };
};

// The value cell sitting beside a benefit label.
const valueFor = (label) => {
  const cell = screen.getByRole("rowheader", { name: label });
  const row = cell.closest("tr");
  return within(row).getAllByRole("gridcell").at(-1);
};

describe("PlanComponent", () => {
  it("shows the plan name from the group", () => {
    renderPlan(groupOf(makePlan({ planName: "Devoted Core (HMO)" })));

    expect(screen.getByText("Devoted Core (HMO)")).toBeInTheDocument();
  });

  it("renders the benefit highlights for the plan", () => {
    renderPlan(
      groupOf(
        makePlan({
          monthlyPremium: 0,
          moop: 4500,
          rxCoverage: true,
          planType: "HMO",
          drVisit: 10,
          erVisit: 110,
          hospitalStay: 295,
          hospitalStayLength: 5,
          dentalBenefit: 2000,
        }),
      ),
    );

    expect(valueFor("Monthly Premium")).toHaveTextContent("$0");
    expect(valueFor("Max-out-of-Pocket (In-Network)")).toHaveTextContent("$4500");
    expect(valueFor("Drug Coverage")).toHaveTextContent("Included");
    expect(valueFor("Plan Type")).toHaveTextContent("HMO");
    expect(valueFor("PCP Visit")).toHaveTextContent("$10");
    expect(valueFor("ER Visit")).toHaveTextContent("$110");
    expect(valueFor("Hospital Stay")).toHaveTextContent(
      "$295 copay per day, days 1-5",
    );
    expect(valueFor("Dental Benefit")).toHaveTextContent("$2000 per year");
  });

  it("says when drug coverage is not included", () => {
    renderPlan(groupOf(makePlan({ rxCoverage: false })));

    expect(valueFor("Drug Coverage")).toHaveTextContent("Not Included");
  });

  describe("hospital surgery", () => {
    it("shows 20% coinsurance when the plan is not a copay plan", () => {
      renderPlan(groupOf(makePlan({ surgeryCopayType: false })));

      expect(valueFor("Hospital Surgery")).toHaveTextContent("20%");
    });

    it("shows a single amount when the copay does not vary", () => {
      renderPlan(
        groupOf(makePlan({ surgeryCopayType: true, surgeryMin: 300, surgeryMax: 300 })),
      );

      expect(valueFor("Hospital Surgery")).toHaveTextContent("$300");
    });

    it("shows a range when the copay varies", () => {
      renderPlan(
        groupOf(makePlan({ surgeryCopayType: true, surgeryMin: 250, surgeryMax: 350 })),
      );

      expect(valueFor("Hospital Surgery")).toHaveTextContent("$250 - $350");
    });
  });

  describe("radiology", () => {
    it("labels the row as coinsurance when a coinsurance amount is set", () => {
      renderPlan(groupOf(makePlan({ radiologyCoinsurance: 20 })));

      expect(valueFor("Radiology Coinsurance")).toHaveTextContent("$20");
      expect(screen.queryByText("Radiology Copay")).not.toBeInTheDocument();
    });

    it("labels the row as a copay otherwise", () => {
      renderPlan(
        groupOf(
          makePlan({
            radiologyCoinsurance: 0,
            radiologyCopayMin: 50,
            radiologyCopayMax: 100,
          }),
        ),
      );

      expect(valueFor("Radiology Copay")).toHaveTextContent("$50 - $100");
    });

    it("collapses an identical copay range to one amount", () => {
      renderPlan(
        groupOf(
          makePlan({
            radiologyCoinsurance: 0,
            radiologyCopayMin: 75,
            radiologyCopayMax: 75,
          }),
        ),
      );

      expect(valueFor("Radiology Copay")).toHaveTextContent("$75");
    });
  });

  describe("OTC and giveback", () => {
    it("shows the OTC credit and capitalises its renewal period", () => {
      renderPlan(groupOf(makePlan({ otcCredit: 75, otcRenewal: "quarterly" })));

      expect(valueFor("OTC Credit")).toHaveTextContent("$75");
      expect(valueFor("OTC Renewal")).toHaveTextContent("Quarterly");
    });

    it("shows N/A when there is no OTC credit or renewal period", () => {
      renderPlan(groupOf(makePlan({ otcCredit: 0, otcRenewal: "" })));

      expect(valueFor("OTC Credit")).toHaveTextContent("N/A");
      expect(valueFor("OTC Renewal")).toHaveTextContent("N/A");
    });

    it("shows the Part B giveback as a monthly amount", () => {
      renderPlan(groupOf(makePlan({ givebackAmount: 50 })));

      expect(valueFor("Part B Giveback")).toHaveTextContent("$50 per month");
    });

    it("shows N/A when the plan has no giveback", () => {
      renderPlan(groupOf(makePlan({ givebackAmount: 0 })));

      expect(valueFor("Part B Giveback")).toHaveTextContent("N/A");
    });
  });

  describe("plan-year toggle", () => {
    it("offers every year the site publishes", () => {
      renderPlan(groupOf(makePlan({ planYear: 2026 })));

      expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2027" })).toBeInTheDocument();
    });

    it("opens on the plan's earliest year", () => {
      renderPlan(
        groupOf(
          makePlan({ id: 1, planGroupId: 7, planYear: 2027 }),
          makePlan({ id: 2, planGroupId: 7, planYear: 2026 }),
        ),
      );

      expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "2027" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("swaps in the selected year's benefits", async () => {
      const { user } = renderPlan(
        groupOf(
          makePlan({ id: 1, planGroupId: 7, planYear: 2026, monthlyPremium: 0 }),
          makePlan({ id: 2, planGroupId: 7, planYear: 2027, monthlyPremium: 35 }),
        ),
      );

      expect(valueFor("Monthly Premium")).toHaveTextContent("$0");

      await user.click(screen.getByRole("button", { name: "2027" }));

      expect(valueFor("Monthly Premium")).toHaveTextContent("$35");
    });

    it("marks a year the plan is not offered in", () => {
      renderPlan(groupOf(makePlan({ planYear: 2026 })));

      expect(screen.getByRole("button", { name: "2027" })).toHaveAttribute(
        "title",
        "Not offered in 2027",
      );
      expect(screen.getByRole("button", { name: "2026" })).not.toHaveAttribute(
        "title",
      );
    });

    it("explains the gap instead of erroring when that year has no record", async () => {
      const { user } = renderPlan(groupOf(makePlan({ planYear: 2026 })));

      await user.click(screen.getByRole("button", { name: "2027" }));

      expect(
        screen.getByText("2027 plan info not available until October 1st"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("This plan is available for 2026."),
      ).toBeInTheDocument();
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    });

    it("lists both years when a plan is offered in both", async () => {
      const group = groupOf(
        makePlan({ id: 1, planGroupId: 7, planYear: 2026 }),
        makePlan({ id: 2, planGroupId: 7, planYear: 2027 }),
      );
      // Force the empty state by asking for a year neither record covers.
      group.byYear.delete("2026");
      group.byYear.delete("2027");
      renderPlan({ ...group, years: ["2026", "2027"] });

      expect(
        screen.getByText("This plan is available for 2026 and 2027."),
      ).toBeInTheDocument();
    });

    it("says so when the group has no published years at all", () => {
      const group = groupOf(makePlan({ planYear: 2026 }));
      renderPlan({ ...group, years: [], byYear: new Map() });

      expect(
        screen.getByText("This plan has no published benefits."),
      ).toBeInTheDocument();
    });
  });

  describe("placeholder plan-years", () => {
    const unpublished = () =>
      groupOf(makePlan({ planYear: 2027, benefitsPublished: false }));

    it("warns that the benefits are not published yet", () => {
      renderPlan(unpublished());

      expect(
        screen.getByText("2027 benefits have not been published yet."),
      ).toBeInTheDocument();
    });

    it("renders N/A rather than a wall of $0 benefits", () => {
      renderPlan(unpublished());

      expect(valueFor("Monthly Premium")).toHaveTextContent("N/A");
      expect(valueFor("Max-out-of-Pocket (In-Network)")).toHaveTextContent("N/A");
      expect(valueFor("Drug Coverage")).toHaveTextContent("N/A");
      expect(valueFor("Hospital Stay")).toHaveTextContent("N/A");
      expect(valueFor("Hospital Surgery")).toHaveTextContent("N/A");
    });

    it("treats a plan with no benefitsPublished field as published", () => {
      renderPlan(groupOf(makePlan({ benefitsPublished: undefined })));

      expect(
        screen.queryByText(/benefits have not been published yet/),
      ).not.toBeInTheDocument();
      expect(valueFor("Monthly Premium")).toHaveTextContent("$0");
    });

    it("hides the chronic-condition note for an unpublished C-SNP", () => {
      renderPlan(
        groupOf(makePlan({ planType: "C-SNP", benefitsPublished: false })),
      );

      expect(
        screen.queryByText(/qualifying\s+chronic conditions/),
      ).not.toBeInTheDocument();
    });
  });

  describe("plan notes", () => {
    it("flags C-SNP plans as condition-restricted", () => {
      renderPlan(groupOf(makePlan({ planType: "C-SNP" })));

      expect(
        screen.getByText(/only for individuals with certain qualifying/i),
      ).toBeInTheDocument();
    });

    it("leaves the note off other plan types", () => {
      renderPlan(groupOf(makePlan({ planType: "HMO" })));

      expect(
        screen.queryByText(/only for individuals with certain qualifying/i),
      ).not.toBeInTheDocument();
    });

    it("adds the Food&Home note only for Devoted", () => {
      renderPlan(groupOf(makePlan()), {
        preloadedState: { selectedCompany: { value: "Devoted" } },
      });

      expect(screen.getByText(/Food&Home card/)).toBeInTheDocument();
    });

    it("leaves the Food&Home note off other companies", () => {
      renderPlan(groupOf(makePlan()), {
        preloadedState: { selectedCompany: { value: "PacificSource" } },
      });

      expect(screen.queryByText(/Food&Home card/)).not.toBeInTheDocument();
    });

    it("names the selected company in the contract disclaimer", () => {
      renderPlan(groupOf(makePlan()), {
        preloadedState: { selectedCompany: { value: "PacificSource" } },
      });

      expect(
        screen.getByText(
          /PacificSource is a Medicare Advantage plan with a Medicare contract/,
        ),
      ).toBeInTheDocument();
    });

    it("always shows the summary-of-benefits disclaimer", () => {
      renderPlan(groupOf(makePlan()));

      expect(
        screen.getByText(/brief summary, not a complete description of benefits/),
      ).toBeInTheDocument();
    });
  });

  describe("comparison actions", () => {
    it("offers to add a plan that is not being compared", async () => {
      const plan = makePlan({ id: 1 });
      const { user, addToCompare } = renderPlan(groupOf(plan));

      await user.click(screen.getByRole("button", { name: "Add to compare" }));

      expect(addToCompare).toHaveBeenCalledWith(plan);
    });

    it("offers to remove a plan that is already being compared", async () => {
      const plan = makePlan({ id: 1 });
      const { user, removeFromCompare } = renderPlan(groupOf(plan), {
        preloadedState: { comparedPlans: { value: [plan], notice: null } },
      });

      expect(
        screen.queryByRole("button", { name: "Add to compare" }),
      ).not.toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: "Remove from compare" }),
      );

      expect(removeFromCompare).toHaveBeenCalledWith(plan);
    });

    it("tracks the selected year, so each plan-year is compared separately", async () => {
      const y26 = makePlan({ id: 1, planGroupId: 7, planYear: 2026 });
      const y27 = makePlan({ id: 2, planGroupId: 7, planYear: 2027 });
      const { user, addToCompare } = renderPlan(groupOf(y26, y27), {
        preloadedState: { comparedPlans: { value: [y26], notice: null } },
      });

      // The 2026 record is in the comparison...
      expect(
        screen.getByRole("button", { name: "Remove from compare" }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "2027" }));

      // ...but the 2027 one is not.
      await user.click(screen.getByRole("button", { name: "Add to compare" }));

      expect(addToCompare).toHaveBeenCalledWith(y27);
    });

    it("offers no comparison button for a year with no record", async () => {
      const { user } = renderPlan(groupOf(makePlan({ planYear: 2026 })));

      await user.click(screen.getByRole("button", { name: "2027" }));

      expect(
        screen.queryByRole("button", { name: /compare/i }),
      ).not.toBeInTheDocument();
    });
  });
});
