import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import MeetingComponent from "../MeetingComponent";

const meeting = {
  venue: "Lebanon Public Library",
  address: "55 Academy St, Lebanon, OR 97355",
  month: "October",
  day: "9",
  startTime: "10:30 am",
};

describe("MeetingComponent", () => {
  it("shows the venue, date and address", () => {
    renderWithProviders(<MeetingComponent {...meeting} />);

    expect(screen.getByText(meeting.venue)).toBeInTheDocument();
    expect(screen.getByText(meeting.address)).toBeInTheDocument();
    expect(screen.getByText(/October 9, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/10:30 am/)).toBeInTheDocument();
  });

  it("offers an RSVP button", () => {
    renderWithProviders(<MeetingComponent {...meeting} />);

    expect(screen.getByRole("button", { name: "RSVP" })).toBeInTheDocument();
  });

  it("stores this meeting and opens the RSVP form when RSVP is pressed", async () => {
    const { store, user } = renderWithProviders(
      <MeetingComponent {...meeting} />,
    );

    await user.click(screen.getByRole("button", { name: "RSVP" }));

    expect(store.getState().meetingRsvp.value).toEqual({
      month: "October",
      day: "9",
      venue: "Lebanon Public Library",
    });
    expect(store.getState().showRsvpForm.value).toBe(true);
  });

  it("does not open the contact form instead of the RSVP form", async () => {
    const { store, user } = renderWithProviders(
      <MeetingComponent {...meeting} />,
    );

    await user.click(screen.getByRole("button", { name: "RSVP" }));

    expect(store.getState().showContactForm.value).toBe(false);
  });

  it("replaces a previously stored meeting", async () => {
    const { store, user } = renderWithProviders(
      <MeetingComponent {...meeting} venue="Newport Public Library" />,
      {
        preloadedState: {
          meetingRsvp: { value: { month: "November", day: "6", venue: "Old" } },
        },
      },
    );

    await user.click(screen.getByRole("button", { name: "RSVP" }));

    expect(store.getState().meetingRsvp.value.venue).toBe(
      "Newport Public Library",
    );
  });
});
