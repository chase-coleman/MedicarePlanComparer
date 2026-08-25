import React, { useState } from "react";
import "../data/meetings";
import ButtonComponent from "../components/ButtonComponent";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Modal,
} from "@heroui/react";
import MeetingComponent from "../components/MeetingComponent";
import {
  lebanonMeetings,
  newportMeetings,
  sweethomeMeetings,
  tillamookMeetings,
} from "../data/meetings";
import RsvpForm from "../components/RsvpForm";

const FindAMeetingPage = () => {
  const [county, setCounty] = useState("");

  return (
    <>
      <div className="find-us-page-container w-[100vw] mt-2">
        <div className="county-container w-[92vw]">
          <div>
            <span className="section-title">Select your county:</span>
          </div>
          <div className="county-buttons-container">
            <ButtonComponent
              text="Linn"
              onPress={() => setCounty("Linn")}
              className={
                county == `Linn`
                  ? `btn-pill-active`
                  : "btn-pill"
              }
            />
            <ButtonComponent
              text="Tillamook"
              onPress={() => setCounty("Tillamook")}
              className={
                county == `Tillamook`
                  ? `btn-pill-active`
                  : "btn-pill"
              }
            />
            <ButtonComponent
              text="Lincoln"
              onPress={() => setCounty("Lincoln")}
              className={
                county == `Lincoln`
                  ? `btn-pill-active`
                  : "btn-pill"
              }
            />
          </div>
        </div>
        <div
          className={
            county == "Linn"
              ? "meeting-container w-[92vw]"
              : "meeting-container w-[92vw]"
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
              <div className="lebanon-sweethome-meeting-container w-[92vw]">
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
