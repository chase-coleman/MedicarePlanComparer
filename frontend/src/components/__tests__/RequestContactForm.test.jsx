import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import {
  act,
  fireEvent,
  renderWithProviders,
  screen,
  waitFor,
} from "../../test/utils";
import RequestContactForm from "../RequestContactForm";

vi.mock("axios");

const API = "https://api.test.local/api/request-call";

// Fills the form in one go. Per-keystroke behaviour (digit stripping, the
// character counter) has its own tests; typing every field out again in each
// submission test only makes them slow and flaky.
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

describe("RequestContactForm", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ status: 202 });
  });

  it("introduces itself as the call-request form", () => {
    renderWithProviders(<RequestContactForm />);

    expect(
      screen.getByRole("heading", { name: "Request a call" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a licensed agent will follow up/i),
    ).toBeInTheDocument();
  });

  it("asks for the fields the backend expects", () => {
    renderWithProviders(<RequestContactForm />);

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

  it("requires a name and phone number", () => {
    renderWithProviders(<RequestContactForm />);

    expect(screen.getByLabelText("First Name")).toBeRequired();
    expect(screen.getByLabelText("Last Name")).toBeRequired();
    expect(screen.getByLabelText("Phone Number")).toBeRequired();
  });

  it("shows the consent language the agents are required to give", () => {
    renderWithProviders(<RequestContactForm />);

    expect(
      screen.getByText(/a licensed sales agent may\s+contact you/i),
    ).toBeInTheDocument();
  });

  it("closes the modal from the ✕ button without submitting", async () => {
    const { store, user } = renderWithProviders(<RequestContactForm />, {
      preloadedState: { showContactForm: { value: true } },
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(store.getState().showContactForm.value).toBe(false);
    expect(axios.post).not.toHaveBeenCalled();
  });

  describe("phone field", () => {
    it("keeps only digits", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.type(screen.getByLabelText("Phone Number"), "(541) 555-1234");

      expect(screen.getByLabelText("Phone Number")).toHaveValue("5415551234");
    });

    it("stops at ten digits", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.type(screen.getByLabelText("Phone Number"), "54155512349999");

      expect(screen.getByLabelText("Phone Number")).toHaveValue("5415551234");
    });

    it("validates against a ten-digit pattern", () => {
      renderWithProviders(<RequestContactForm />);

      expect(screen.getByLabelText("Phone Number")).toHaveAttribute(
        "pattern",
        "[0-9]{10}",
      );
    });
  });

  describe("message field", () => {
    it("counts characters against the 250 limit", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      expect(screen.getByText("0/250")).toBeInTheDocument();

      await user.type(screen.getByLabelText("Message"), "Hello");

      expect(screen.getByText("5/250")).toBeInTheDocument();
    });

    it("caps input at 250 characters", () => {
      renderWithProviders(<RequestContactForm />);

      expect(screen.getByLabelText("Message")).toHaveAttribute(
        "maxlength",
        "250",
      );
    });
  });

  describe("submitting", () => {
    it("posts the collected details to the request-call endpoint", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn({ Message: "Please call mornings" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(API, {
          fname: "Ada",
          lname: "Lovelace",
          email: "ada@example.com",
          phone: "5415551234",
          message: "Please call mornings",
        }),
      );
    });

    it("sends an empty message when the user leaves it blank", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(
          API,
          expect.objectContaining({ message: "" }),
        ),
      );
    });

    it("confirms success in place of the form when the API accepts", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Request submitted successfully"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Someone will be contacting you soon."),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("First Name")).not.toBeInTheDocument();
    });

    it("keeps the form up and warns when the API answers with anything else", async () => {
      axios.post.mockResolvedValue({ status: 200 });
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => expect(warn).toHaveBeenCalled());
      expect(
        screen.queryByText("Request submitted successfully"),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    });

    it("stores a readable error when the request fails", async () => {
      axios.post.mockRejectedValue({
        response: { status: 500, data: { message: "Mailer unavailable" } },
      });
      const { store, user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe("Mailer unavailable"),
      );
      expect(
        screen.queryByText("Request submitted successfully"),
      ).not.toBeInTheDocument();
    });

    it("stores the offline message when the server never answers", async () => {
      axios.post.mockRejectedValue({ request: {} });
      const { store, user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe(
          "No response from server. Please refresh or try again later.",
        ),
      );
    });

    it("explains an email that is missing a proper domain", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

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
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn({ "Phone Number": "54155" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Enter a valid 10-digit number"),
      ).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("asks for the phone number when it is left blank", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn({ "Phone Number": "" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Please enter your phone number"),
      ).toBeInTheDocument();
    });

    it("does not submit while required fields are empty", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("after a successful submission", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    // Driven with fireEvent rather than userEvent: the auto-close is a timer,
    // and typing under fake timers is far slower than it is worth here.
    const submitForm = async (container) => {
      fillIn();
      // act() so the state update from the resolved post settles here rather
      // than leaking into the next assertion.
      await act(async () => {
        fireEvent.submit(container.querySelector("form"));
      });
    };

    it("closes the modal five seconds later", async () => {
      const { store, container } = renderWithProviders(<RequestContactForm />, {
        preloadedState: { showContactForm: { value: true } },
      });

      await submitForm(container);
      await vi.waitFor(() =>
        expect(
          screen.getByText("Request submitted successfully"),
        ).toBeInTheDocument(),
      );

      expect(store.getState().showContactForm.value).toBe(true);

      await act(() => vi.advanceTimersByTimeAsync(5000));

      expect(store.getState().showContactForm.value).toBe(false);
    });

    it("leaves the modal open while the confirmation is still showing", async () => {
      const { store, container } = renderWithProviders(<RequestContactForm />, {
        preloadedState: { showContactForm: { value: true } },
      });

      await submitForm(container);
      await vi.waitFor(() =>
        expect(
          screen.getByText("Request submitted successfully"),
        ).toBeInTheDocument(),
      );

      await act(() => vi.advanceTimersByTimeAsync(4000));

      expect(store.getState().showContactForm.value).toBe(true);
    });

    it("does not close the modal when the submission failed", async () => {
      axios.post.mockResolvedValue({ status: 200 });
      vi.spyOn(console, "warn").mockImplementation(() => {});
      const { store, container } = renderWithProviders(<RequestContactForm />, {
        preloadedState: { showContactForm: { value: true } },
      });

      await submitForm(container);
      await act(() => vi.advanceTimersByTimeAsync(5000));

      expect(store.getState().showContactForm.value).toBe(true);
    });

    it("cancels the timer if the form unmounts first", async () => {
      const { store, container, unmount } = renderWithProviders(
        <RequestContactForm />,
        { preloadedState: { showContactForm: { value: true } } },
      );

      await submitForm(container);
      await vi.waitFor(() =>
        expect(
          screen.getByText("Request submitted successfully"),
        ).toBeInTheDocument(),
      );
      unmount();

      await act(() => vi.advanceTimersByTimeAsync(5000));

      // The close would have come from a timer that outlived the component.
      expect(store.getState().showContactForm.value).toBe(true);
    });
  });
});
