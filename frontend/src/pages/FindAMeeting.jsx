import { useState } from "react";
import "../data/meetings";
import ButtonComponent from "../components/ButtonComponent";
import MeetingComponent from "../components/MeetingComponent";
import {
  lebanonMeetings,
  newportMeetings,
  sweethomeMeetings,
  tillamookMeetings,
} from "../data/meetings";
import { MEETINGS_SCHEDULED, MEETINGS_PENDING_MESSAGE } from "../data/constants/meetings";

// label is the button text; value is what gets stored in `county` and matched below.
const COUNTY_BUTTONS = [
  { label: "Linn", value: "Linn" },
  { label: "Tillamook", value: "Tillamook" },
  { label: "Lincoln", value: "Lincoln" },
];

const FindAMeetingPage = () => {
  const [county, setCounty] = useState("");
  // Whether there are meetings to show at all. Seeded from MEETINGS_SCHEDULED
  // in data/constants/meetings.js -- flip that to true and the county buttons and their
  // meeting lists render exactly as before.
  const [hasMeetings] = useState(MEETINGS_SCHEDULED);

  if (!hasMeetings) {
    return (
      <div className="find-us-page-container w-full mt-2">
        <p className="site-notice">{MEETINGS_PENDING_MESSAGE}</p>
      </div>
    );
  }

  return (
    <>
      <div className="find-us-page-container w-full mt-2">
        <div className="county-container w-full">
          <div>
            <span className="section-title">Select your county:</span>
          </div>
          <div className="county-buttons-container">
            {COUNTY_BUTTONS.map((button) => (
              <ButtonComponent
                key={button.value}
                text={button.label}
                onPress={() => setCounty(button.value)}
                className={county == button.value ? "btn-pill-active" : "btn-pill"}
              />
            ))}
          </div>
        </div>
        <div
          className={
            county == "Linn"
              ? "meeting-container w-full"
              : "meeting-container w-full"
          }
        >
          {county == "Lincoln" ? (
            <>
              {newportMeetings.map((meeting) => (
                <MeetingComponent
                  key={meeting.day}
                  venue={meeting.venueName}
                  address={meeting.address}
                  month={meeting.month}
                  day={meeting.day}
                  startTime={meeting.startTime}
                />
              ))}
            </>
          ) : county == "Tillamook" ? (
            <>
              {tillamookMeetings.map((meeting) => (
                <MeetingComponent
                  key={meeting.day}
                  venue={meeting.venueName}
                  address={meeting.address}
                  month={meeting.month}
                  day={meeting.day}
                  startTime={meeting.startTime}
                />
              ))}
            </>
          ) : county == "Linn" ? (
            <>
              <div className="lebanon-sweethome-meeting-container w-full">
                <div className="l-sh-cols">
                  <span className="section-title mb-1">Lebanon Meetings:</span>
                  {lebanonMeetings.map((meeting) => (
                    <MeetingComponent
                      key={meeting.day}
                      venue={meeting.venueName}
                      address={meeting.address}
                      month={meeting.month}
                      day={meeting.day}
                      startTime={meeting.startTime}
                    />
                  ))}
                </div>
                <div className="l-sh-cols">
                  <span className="section-title mb-1">
                    Sweethome Meetings:
                  </span>
                  {sweethomeMeetings.map((meeting) => (
                    <MeetingComponent
                      key={meeting.day}
                      venue={meeting.venueName}
                      address={meeting.address}
                      month={meeting.month}
                      day={meeting.day}
                      startTime={meeting.startTime}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default FindAMeetingPage;
