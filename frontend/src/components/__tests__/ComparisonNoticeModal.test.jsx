import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import ComparisonNoticeModal from "../ComparisonNoticeModal";
import { makePlan } from "../../test/fixtures";

const notice = {
  type: "limit",
  title: "You can compare up to 3 plans",
  msg: "Only 3 plans can be compared at once.",
};

const withNotice = (value = notice) => ({
  comparedPlans: { value: [], notice: value },
});

describe("ComparisonNoticeModal", () => {
  it("renders the notice title and message from the store", () => {
    renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice(),
    });

    expect(screen.getByText(notice.title)).toBeInTheDocument();
    expect(screen.getByText(notice.msg)).toBeInTheDocument();
  });

  it("tells the user how to make room", () => {
    renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice(),
    });

    expect(
      screen.getByText(/Remove a plan from your comparison/i),
    ).toBeInTheDocument();
  });

  it("exposes itself as a labelled alert dialog", () => {
    renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice(),
    });

    const dialog = screen.getByRole("alertdialog", { name: notice.title });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(notice.msg);
  });

  it("renders nothing when there is no notice", () => {
    const { container } = renderWithProviders(<ComparisonNoticeModal />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(container.querySelector(".notice-modal")).toBeNull();
  });

  it("renders a duplicate notice just as well as a limit notice", () => {
    renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice({
        type: "duplicate",
        title: "Plan already added",
        msg: "Plan is already selected to compare",
      }),
    });

    expect(screen.getByText("Plan already added")).toBeInTheDocument();
  });

  it("clears the notice when its dismiss button is pressed", async () => {
    const { store, user } = renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice(),
    });

    await user.click(screen.getByRole("button"));

    expect(store.getState().comparedPlans.notice).toBeNull();
  });

  it("clears the notice on Escape", async () => {
    const { store, user } = renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: withNotice(),
    });

    await user.keyboard("{Escape}");

    expect(store.getState().comparedPlans.notice).toBeNull();
  });

  it("leaves the compared plans alone when dismissed", async () => {
    const plan = makePlan({ id: 1 });
    const { store, user } = renderWithProviders(<ComparisonNoticeModal />, {
      preloadedState: { comparedPlans: { value: [plan], notice } },
    });

    await user.keyboard("{Escape}");

    expect(store.getState().comparedPlans.value).toEqual([plan]);
  });

  it("stops listening for Escape once unmounted", async () => {
    const { store, user, unmount } = renderWithProviders(
      <ComparisonNoticeModal />,
      { preloadedState: withNotice() },
    );

    unmount();
    store.dispatch({ type: "noop" });
    await user.keyboard("{Escape}");

    // The listener is gone, so the notice would only clear if it leaked.
    expect(store.getState().comparedPlans.notice).toEqual(notice);
  });
});
