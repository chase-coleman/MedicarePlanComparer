import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import LandingPage from "../pages/LandingPage";
import ExplorePage from "../pages/ExplorePage";
import ComparePage from "../pages/ComparePage";
import FindAMeetingPage from "../pages/FindAMeeting";
import { createTestStore } from "../test/utils";
import { makeCompany, makePlan } from "../test/fixtures";

vi.mock("axios");

// The meeting journey only exists while meetings are switched on, and the real
// lists empty out between enrollment seasons. Both are pinned here so this flow
// stays covered whatever the live data and the MEETINGS_SCHEDULED switch say.
vi.mock("../data/meetings", () => ({
  tillamookMeetings: [
    {
      county: "Tillamook",
      venueName: "Tillamook Library",
      address: "1716 3rd St, Tillamook, OR 97141",
      month: "October",
      day: "2",
      startTime: "10:30 am",
    },
  ],
  newportMeetings: [],
  lebanonMeetings: [],
  sweethomeMeetings: [],
}));

vi.mock("../data/constants", async (importOriginal) => ({
  ...(await importOriginal()),
  MEETINGS_SCHEDULED: true,
}));

const API = "https://api.test.local/";

// Mirrors src/router.jsx, with an in-memory history so each test starts clean.
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "find-meeting", element: <FindAMeetingPage /> },
    ],
  },
];

const renderApp = (initialEntry = "/") => {
  const store = createTestStore();
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  return {
    store,
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <HeroUIProvider disableAnimation>
          <RouterProvider router={router} />
        </HeroUIProvider>
      </Provider>,
    ),
  };
};

// Contact details, set directly; the forms' own suites cover typing.
const fillIn = (overrides = {}) => {
  const values = {
    "First Name": "Ada",
    "Last Name": "Lovelace",
    Email: "ada@example.com",
    "Phone Number": "5415551234",
    ...overrides,
  };
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
};

const PLANS = [
  makePlan({ id: 1, planGroupId: 1, planName: "Devoted Core" }),
  makePlan({ id: 2, planGroupId: 2, planName: "Devoted Giveback" }),
  makePlan({ id: 3, planGroupId: 3, planName: "Devoted Prime" }),
  makePlan({ id: 4, planGroupId: 4, planName: "Devoted Select" }),
];

beforeEach(() => {
  axios.get.mockImplementation((url) =>
    Promise.resolve({
      data: url.replace(API, "").includes("/")
        ? PLANS
        : [makeCompany({ id: 1, companyName: "Devoted" })],
    }),
  );
  axios.post.mockResolvedValue({ status: 202 });
});

describe("choosing plans and comparing them", () => {
  it("carries a plan picked on the explore page over to the compare page", async () => {
    const { user } = renderApp("/explore");

    await user.click(screen.getByRole("button", { name: "Linn" }));
    await user.click(await screen.findByRole("button", { name: "Devoted" }));

    const card = (await screen.findByText("Devoted Core")).closest(".plan-card");
    await user.click(within(card).getByRole("button", { name: "Add to compare" }));

    await user.click(screen.getByRole("link", { name: "Compare Plans" }));

    expect(await screen.findByText("Devoted Core")).toBeInTheDocument();
    expect(screen.queryByText("No plans selected yet")).not.toBeInTheDocument();
  });

  it("shows the empty state on the compare page until something is picked", async () => {
    const { user } = renderApp("/");

    await user.click(screen.getByRole("link", { name: "Compare Plans" }));

    expect(await screen.findByText("No plans selected yet")).toBeInTheDocument();
  });

  it("stops at three plans and explains why", async () => {
    const { store, user } = renderApp("/explore");

    await user.click(screen.getByRole("button", { name: "Linn" }));
    await user.click(await screen.findByRole("button", { name: "Devoted" }));

    const buttons = await screen.findAllByRole("button", {
      name: "Add to compare",
    });
    for (const button of buttons) {
      await user.click(button);
    }

    expect(store.getState().comparedPlans.value).toHaveLength(3);
    const dialog = await screen.findByRole("alertdialog");
    expect(
      within(dialog).getByText("You can compare up to 3 plans"),
    ).toBeInTheDocument();
  });

  it("dismisses the limit notice and lets the user carry on", async () => {
    const { store, user } = renderApp("/explore");

    await user.click(screen.getByRole("button", { name: "Linn" }));
    await user.click(await screen.findByRole("button", { name: "Devoted" }));
    for (const button of await screen.findAllByRole("button", {
      name: "Add to compare",
    })) {
      await user.click(button);
    }

    await user.click(document.querySelector(".modal-backdrop"));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(store.getState().comparedPlans.value).toHaveLength(3);
  });

  it("swaps the footer disclaimer to match the chosen county", async () => {
    const { user } = renderApp("/explore");

    await user.click(screen.getByRole("button", { name: "Tillamook" }));

    expect(
      await screen.findByText(/In Tillamook County, we represent/),
    ).toBeInTheDocument();
  });
});

describe("requesting a call", () => {
  it("submits the form opened from the landing page", async () => {
    const { user } = renderApp("/");

    await user.click(
      within(document.querySelector(".headline-container")).getByRole("button", {
        name: "Request a call",
      }),
    );

    await user.type(screen.getByLabelText("First Name"), "Ada");
    fillIn({
      "Last Name": "Lovelace",
      Email: "ada@example.com",
      "Phone Number": "5415551234",
    });
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${API}api/request-call`,
        expect.objectContaining({ fname: "Ada", phone: "5415551234" }),
      ),
    );
    expect(
      await screen.findByText("Request submitted successfully"),
    ).toBeInTheDocument();
  });
});

describe("RSVPing for a meeting", () => {
  it("opens the RSVP form for the meeting the user picked", async () => {
    const { user } = renderApp("/find-meeting");

    await user.click(screen.getByRole("button", { name: "Tillamook" }));
    const firstCard = document.querySelector(".meeting-card");
    const venue = firstCard.querySelector(".meeting-venue").textContent;
    await user.click(within(firstCard).getByRole("button", { name: "RSVP" }));

    expect(
      screen.getByRole("heading", { name: "RSVP for this meeting" }),
    ).toBeInTheDocument();

    fillIn();
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        `${API}api/request-call`,
        expect.objectContaining({
          message: expect.stringContaining(`at ${venue}`),
        }),
      ),
    );
  });

  it("reaches the meeting finder from the landing page", async () => {
    const { user } = renderApp("/");

    await user.click(
      screen.getByRole("link", { name: /Find a Medicare meeting/i }),
    );

    expect(await screen.findByText("Select your county:")).toBeInTheDocument();
  });
});
