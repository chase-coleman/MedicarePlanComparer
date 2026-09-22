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
import {
  OREGON_COUNTIES,
  OUTSIDE_OREGON,
} from "../../data/constants/counties";

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

// Chooses a county from the Autocomplete the way a visitor would.
const pickCounty = async (user, name) => {
  await user.type(
    screen.getByRole("combobox", { name: /County/ }),
    name.slice(0, 3),
  );
  await user.click(screen.getByRole("option", { name }));
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

  describe("county field", () => {
    const countyBox = () => screen.getByRole("combobox", { name: /County/ });
    const shownOptions = () =>
      screen.getAllByRole("option").map((option) => option.textContent);

    it("is required", () => {
      renderWithProviders(<RequestContactForm />);

      expect(countyBox()).toBeRequired();
    });

    it("offers every Oregon county plus an out-of-state option", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.click(countyBox());

      expect(shownOptions()).toEqual([...OREGON_COUNTIES, OUTSIDE_OREGON]);
      expect(OREGON_COUNTIES).toHaveLength(36);
    });

    it("suggests only counties that start with what was typed", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.type(countyBox(), "li");

      // Gilliam contains "li" but does not start with it
      expect(shownOptions()).toEqual(["Lincoln", "Linn"]);
    });

    it("ignores letter case", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      await user.type(countyBox(), "MUL");

      expect(shownOptions()).toEqual(["Multnomah"]);
    });

    it("sends the chosen county with the request", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.type(countyBox(), "Ben");
      await user.click(screen.getByRole("option", { name: "Benton" }));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(
          API,
          expect.objectContaining({ county: "Benton" }),
        ),
      );
    });

    it("does not submit without a county", async () => {
      const { user } = renderWithProviders(<RequestContactForm />);

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("starts blank even when a county was picked on the Explore page", () => {
      renderWithProviders(<RequestContactForm />, {
        preloadedState: { county: { value: "Linn" } },
      });

      expect(countyBox()).toHaveValue("");
    });
  });

  describe("submitting", () => {
    // Every submission needs a county, and the field starts blank.
    const renderReady = async () => {
      const rendered = renderWithProviders(<RequestContactForm />);
      await pickCounty(rendered.user, "Linn");
      return rendered;
    };

    it("posts the collected details to the request-call endpoint", async () => {
      const { user } = await renderReady();

      fillIn({ Message: "Please call mornings" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(axios.post).toHaveBeenCalledWith(API, {
          fname: "Ada",
          lname: "Lovelace",
          email: "ada@example.com",
          phone: "5415551234",
          county: "Linn",
          message: "Please call mornings",
        }),
      );
    });

    it("sends an empty message when the user leaves it blank", async () => {
      const { user } = await renderReady();

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
      const { user } = await renderReady();

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
      const { user } = await renderReady();

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
      const { store, user } = await renderReady();

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
      const { store, user } = await renderReady();

      fillIn();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() =>
        expect(store.getState().errorMsg.value).toBe(
          "No response from server. Please refresh or try again later.",
        ),
      );
    });

    it("explains an email that is missing a proper domain", async () => {
      const { user } = await renderReady();

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
      const { user } = await renderReady();

      fillIn({ "Phone Number": "54155" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Enter a valid 10-digit number"),
      ).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("asks for the phone number when it is left blank", async () => {
      const { user } = await renderReady();

      fillIn({ "Phone Number": "" });
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Please enter your phone number"),
      ).toBeInTheDocument();
    });

    it("does not submit while required fields are empty", async () => {
      const { user } = await renderReady();

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("after a successful submission", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    // Driven with fireEvent rather than userEvent: the auto-close is a timer,
    // and typing under fake timers is far slower than it is worth here.
    // The county is picked first, under real timers, since the Autocomplete
    // needs real pointer events; fake timers start only for the auto-close.
    const submitForm = async (container, user) => {
      await pickCounty(user, "Linn");
      vi.useFakeTimers();
      fillIn();
      // act() so the state update from the resolved post settles here rather
      // than leaking into the next assertion.
      await act(async () => {
        fireEvent.submit(container.querySelector("form"));
      });
    };

    it("closes the modal five seconds later", async () => {
      const { store, container, user } = renderWithProviders(<RequestContactForm />, {
        preloadedState: {
          showContactForm: { value: true },
        },
      });

      await submitForm(container, user);
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
      const { store, container, user } = renderWithProviders(<RequestContactForm />, {
        preloadedState: {
          showContactForm: { value: true },
        },
      });

      await submitForm(container, user);
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
      const { store, container, user } = renderWithProviders(<RequestContactForm />, {
        preloadedState: {
          showContactForm: { value: true },
        },
      });

      await submitForm(container, user);
      await act(() => vi.advanceTimersByTimeAsync(5000));

      expect(store.getState().showContactForm.value).toBe(true);
    });

    it("cancels the timer if the form unmounts first", async () => {
      const { store, container, unmount, user } = renderWithProviders(
        <RequestContactForm />,
        {
          preloadedState: {
            showContactForm: { value: true },
          },
        },
      );

      await submitForm(container, user);
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
