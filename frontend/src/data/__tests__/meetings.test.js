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

// These validate the shape of whatever is scheduled. The lists are emptied
// between enrollment seasons -- the Find a Meeting page covers that state via
// MEETINGS_SCHEDULED -- so emptiness is valid and every check below is written
// to hold vacuously rather than to demand entries.
describe.each(Object.entries(LISTS))("%s", (_name, { meetings, county }) => {
  it("is a list", () => {
    expect(Array.isArray(meetings)).toBe(true);
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
    for (const meeting of meetings) {
      expect(meeting.county).toBe(county);
    }
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
