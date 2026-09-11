import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import {
  act,
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from "../../test/utils";
import RsvpForm from "../RsvpForm";

vi.mock("axios");

const API = "https://api.test.local/api/request-call";

const meetingState = {
  meetingRsvp: {
    value: { month: "October", day: "9", venue: "Lebanon Public Library" },
  },
  showRsvpForm: { value: true },
};

// Set in one go rather than typed: the per-keystroke behaviour is covered by
// the contact form's suite, and typing every field makes these tests slow.
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

describe("RsvpForm", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ status: 202 });
  });

  it("introduces itself as the RSVP form", () => {
    renderWithProviders(<RsvpForm />, { preloadedState: meetingState });

    expect(
      screen.getByRole("heading", { name: "RSVP for this meeting" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Reserve your spot/i)).toBeInTheDocument();
  });

  it("asks for the same contact fields as the call request", () => {
    renderWithProviders(<RsvpForm />, { preloadedState: meetingState });

    for (const label of [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "Message",
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("closes the RSVP modal from the ✕ button", async () => {
    const { store, user } = renderWithProviders(<RsvpForm />, {
      preloadedState: meetingState,
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().showRsvpForm.value).toBe(false);
  });

  it("does not touch the contact-form modal when closed", async () => {
    const { store, user } = renderWithProviders(<RsvpForm />, {
      preloadedState: { ...meetingState, showContactForm: { value: true } },
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().showContactForm.value).toBe(true);
  });

  describe("submitting", () => {
    it("appends the meeting details to the message", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn({ Message: "Bringing my spouse" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(API, {
          fname: "Ada",
          lname: "Lovelace",
          email: "ada@example.com",
          phone: "5415551234",
          message:
            "Bringing my spouse | Ada Lovelace is RSVP'ing for the Meeting on October 9 at Lebanon Public Library",
        }),
      );
    });

    it("still identifies the meeting when the user writes no message", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(
          API,
          expect.objectContaining({
            message:
              " | Ada Lovelace is RSVP'ing for the Meeting on October 9 at Lebanon Public Library",
          }),
        ),
      );
    });

    it("names whichever meeting the store holds", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: {
          meetingRsvp: {
            value: {
              month: "November",
              day: "6",
              venue: "Newport Public Library",
            },
          },
        },
      });

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(
          API,
          expect.objectContaining({
            message: expect.stringContaining(
              "Meeting on November 6 at Newport Public Library",
            ),
          }),
        ),
      );
    });

    it("confirms success in place of the form", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Request submitted successfully"),
      ).toBeInTheDocument();
    });

    it("warns and stays put when the API answers with anything but 202", async () => {
      axios.post.mockResolvedValue({ status: 200 });
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => expect(warn).toHaveBeenCalled());
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    });

    it("stores a readable error when the request fails", async () => {
      axios.post.mockRejectedValue({ message: "Network Error" });
      const { store, user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe("Network Error"),
      );
    });

    it("explains an email that is missing a proper domain", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn({ Email: "ada@example" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText(
          "Please enter a valid email (e.g., name@example.com)",
        ),
      ).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("explains a phone number that is not ten digits", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn({ "Phone Number": "54155" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Enter a valid 10-digit number"),
      ).toBeInTheDocument();
    });

    it("does not submit while required fields are empty", async () => {
      const { user } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("after a successful RSVP", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("closes the RSVP modal five seconds later", async () => {
      const { store, container } = renderWithProviders(<RsvpForm />, {
        preloadedState: meetingState,
      });

      fillIn();
      await act(async () => {
        fireEvent.submit(container.querySelector("form"));
      });

      await vi.waitFor(() =>
        expect(
          screen.getByText("Request submitted successfully"),
        ).toBeInTheDocument(),
      );
      expect(store.getState().showRsvpForm.value).toBe(true);

      await act(() => vi.advanceTimersByTimeAsync(5000));

      expect(store.getState().showRsvpForm.value).toBe(false);
    });
  });
});
