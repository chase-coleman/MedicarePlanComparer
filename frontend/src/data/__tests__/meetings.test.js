import { describe, it, expect } from "vitest";
import {
  lebanonMeetings,
  newportMeetings,
  sweethomeMeetings,
  tillamookMeetings,
} from "../meetings";

const LISTS = {
  lebanonMeetings: { meetings: lebanonMeetings, county: "Linn" },
  sweethomeMeetings: { meetings: sweethomeMeetings, county: "Linn" },
  newportMeetings: { meetings: newportMeetings, county: "Lincoln" },
  tillamookMeetings: { meetings: tillamookMeetings, county: "Tillamook" },
};

describe.each(Object.entries(LISTS))("%s", (_name, { meetings, county }) => {
  it("is a non-empty list", () => {
    expect(Array.isArray(meetings)).toBe(true);
    expect(meetings.length).toBeGreaterThan(0);
  });

  it("gives every meeting the fields MeetingComponent renders", () => {
    for (const meeting of meetings) {
      expect(Object.keys(meeting).sort()).toEqual([
        "address",
        "county",
        "day",
        "month",
        "startTime",
        "venueName",
      ]);
      for (const value of Object.values(meeting)) {
        expect(typeof value).toBe("string");
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("belongs to a single county", () => {
    expect(new Set(meetings.map((meeting) => meeting.county))).toEqual(
      new Set([county]),
    );
  });

  it("uses days unique within the list, which the page relies on for React keys", () => {
    const days = meetings.map((meeting) => meeting.day);

    expect(new Set(days).size).toBe(days.length);
  });

  it("uses calendar months and day-of-month numbers", () => {
    for (const meeting of meetings) {
      expect(meeting.month).toMatch(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)$/,
      );
      expect(Number(meeting.day)).toBeGreaterThanOrEqual(1);
      expect(Number(meeting.day)).toBeLessThanOrEqual(31);
    }
  });

  it("uses a readable start time", () => {
    for (const meeting of meetings) {
      expect(meeting.startTime).toMatch(/^\d{1,2}:\d{2} ?(am|pm)$/i);
    }
  });
});

describe("meetings data as a whole", () => {
  it("keeps the Linn county lists separate, since the page renders them side by side", () => {
    const lebanonVenues = new Set(lebanonMeetings.map((m) => m.venueName));
    const sweethomeVenues = new Set(sweethomeMeetings.map((m) => m.venueName));

    for (const venue of sweethomeVenues) {
      expect(lebanonVenues.has(venue)).toBe(false);
    }
  });
});
