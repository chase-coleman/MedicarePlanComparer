import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, within } from "../../test/utils";
import FindAMeetingPage from "../FindAMeeting";
import {
  lebanonMeetings,
  newportMeetings,
  sweethomeMeetings,
  tillamookMeetings,
} from "../../data/meetings";

const cards = (container) => container.querySelectorAll(".meeting-card");

describe("FindAMeetingPage", () => {
  it("asks the user to pick a county", () => {
    renderWithProviders(<FindAMeetingPage />);

    expect(screen.getByText("Select your county:")).toBeInTheDocument();
    for (const county of ["Linn", "Tillamook", "Lincoln"]) {
      expect(screen.getByRole("button", { name: county })).toBeInTheDocument();
    }
  });

  it("shows no meetings until a county is chosen", () => {
    const { container } = renderWithProviders(<FindAMeetingPage />);

    expect(cards(container)).toHaveLength(0);
  });

  it("lists the Lincoln county meetings", async () => {
    const { container, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Lincoln" }));

    expect(cards(container)).toHaveLength(newportMeetings.length);
    expect(
      screen.getAllByText(newportMeetings[0].venueName).length,
    ).toBeGreaterThan(0);
  });

  it("lists the Tillamook county meetings", async () => {
    const { container, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Tillamook" }));

    expect(cards(container)).toHaveLength(tillamookMeetings.length);
  });

  it("splits Linn county into Lebanon and Sweethome columns", async () => {
    const { container, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Linn" }));

    expect(screen.getByText("Lebanon Meetings:")).toBeInTheDocument();
    expect(screen.getByText("Sweethome Meetings:")).toBeInTheDocument();
    expect(cards(container)).toHaveLength(
      lebanonMeetings.length + sweethomeMeetings.length,
    );
  });

  it("keeps each Linn column to its own meetings", async () => {
    const { container, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Linn" }));

    const [lebanonColumn, sweethomeColumn] = container.querySelectorAll(
      ".l-sh-cols",
    );
    expect(within(lebanonColumn).getAllByRole("button", { name: "RSVP" })).toHaveLength(
      lebanonMeetings.length,
    );
    expect(
      within(sweethomeColumn).getAllByRole("button", { name: "RSVP" }),
    ).toHaveLength(sweethomeMeetings.length);
  });

  it("swaps the list when a different county is chosen", async () => {
    const { container, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Tillamook" }));
    await user.click(screen.getByRole("button", { name: "Lincoln" }));

    expect(cards(container)).toHaveLength(newportMeetings.length);
    expect(screen.queryByText("Lebanon Meetings:")).not.toBeInTheDocument();
  });

  it("marks the chosen county as active", async () => {
    const { user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Tillamook" }));

    expect(screen.getByRole("button", { name: "Tillamook" })).toHaveClass(
      "btn-pill-active",
    );
    expect(screen.getByRole("button", { name: "Linn" })).toHaveClass("btn-pill");
  });

  it("shows the venue, date and address of each meeting", async () => {
    const { user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Tillamook" }));

    const meeting = tillamookMeetings[0];
    expect(screen.getAllByText(meeting.address).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        new RegExp(`${meeting.month} ${meeting.day}, 2025.*${meeting.startTime}`),
      ),
    ).toBeInTheDocument();
  });

  it("opens the RSVP form for the meeting whose button was pressed", async () => {
    const { store, user } = renderWithProviders(<FindAMeetingPage />);

    await user.click(screen.getByRole("button", { name: "Lincoln" }));
    await user.click(screen.getAllByRole("button", { name: "RSVP" })[1]);

    const meeting = newportMeetings[1];
    expect(store.getState().showRsvpForm.value).toBe(true);
    expect(store.getState().meetingRsvp.value).toEqual({
      month: meeting.month,
      day: meeting.day,
      venue: meeting.venueName,
    });
  });
});
