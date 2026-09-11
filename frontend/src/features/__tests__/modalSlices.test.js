import { describe, it, expect } from "vitest";
import contactReducer, {
  closeModal,
  openModal,
} from "../modal/ShowContactFormSlice";
import rsvpReducer, {
  closeRsvpModal,
  openRsvpModal,
} from "../modal/showRsvpForm";
import meetingReducer, {
  clearMeetingToRsvp,
  setMeetingToRsvp,
} from "../meetings/MeetingToRsvpSlice";

const init = (reducer) => reducer(undefined, { type: "@@INIT" });

describe("showContactFormSlice", () => {
  it("starts closed", () => {
    expect(init(contactReducer)).toEqual({ value: false });
  });

  it("opens", () => {
    expect(contactReducer(undefined, openModal()).value).toBe(true);
  });

  it("closes", () => {
    expect(contactReducer({ value: true }, closeModal()).value).toBe(false);
  });

  it("stays open when opened twice", () => {
    const state = contactReducer(contactReducer(undefined, openModal()), openModal());

    expect(state.value).toBe(true);
  });

  it("does not respond to the RSVP modal's actions", () => {
    expect(contactReducer({ value: false }, openRsvpModal()).value).toBe(false);
  });
});

describe("showRsvpFormSlice", () => {
  it("starts closed", () => {
    expect(init(rsvpReducer)).toEqual({ value: false });
  });

  it("opens and closes", () => {
    const opened = rsvpReducer(undefined, openRsvpModal());

    expect(opened.value).toBe(true);
    expect(rsvpReducer(opened, closeRsvpModal()).value).toBe(false);
  });

  it("does not respond to the contact modal's actions", () => {
    expect(rsvpReducer({ value: false }, openModal()).value).toBe(false);
  });
});

describe("meetingToRsvpSlice", () => {
  const meeting = { month: "October", day: "9", venue: "Lebanon Library" };

  it("starts with no meeting", () => {
    expect(init(meetingReducer)).toEqual({ value: {} });
  });

  it("stores the meeting being RSVP'd for", () => {
    expect(meetingReducer(undefined, setMeetingToRsvp(meeting)).value).toEqual(
      meeting,
    );
  });

  it("replaces a previously stored meeting", () => {
    const state = meetingReducer(
      { value: meeting },
      setMeetingToRsvp({ month: "November", day: "6", venue: "Newport Library" }),
    );

    expect(state.value.venue).toBe("Newport Library");
  });

  it("clears back to an empty object", () => {
    expect(meetingReducer({ value: meeting }, clearMeetingToRsvp()).value).toEqual(
      {},
    );
  });
});
