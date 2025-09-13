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
} from "@heroui/react";
import MeetingComponent from "../components/MeetingComponent";
import {
  lebanonMeetings,
  newportMeetings,
  sweethomeMeetings,
  tillamookMeetings,
} from "../data/meetings";

const FindAMeetingPage = () => {
  const [county, setCounty] = useState("");

  return (
    <>
      <div className="find-us-page-container w-[100vw] mt-2">
        <div className="county-container w-[95vw] h-25">
          <div>
            <span className="text-black font-semibold text-[1.5em]">
              Select your county:
            </span>
          </div>
          <div className="county-buttons-container">
            <ButtonComponent
              text="Linn"
              onPress={() => setCounty("Linn")}
              className={
                county == `Linn`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
            <ButtonComponent
              text="Tillamook"
              onPress={() => setCounty("Tillamook")}
              className={
                county == `Tillamook`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
            <ButtonComponent
              text="Lincoln"
              onPress={() => setCounty("Lincoln")}
              className={
                county == `Lincoln`
                  ? `bg-red-500 text-[FFFFFF] font-semibold`
                  : "bg-main text-[FFFFFF] font-semibold"
              }
            />
          </div>
        </div>
        <div 
        className={county == "Linn" ? 
          "meeting-container w-[95vw]"
          :
          "meeting-container w-[95vw] p-[1em]"
          }>
          {county == "Lincoln" ? (
            <>
              {newportMeetings.map((meeting) => (
                <MeetingComponent
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
              <div className="lebanon-sweethome-meeting-container w-[95vw]">
                <div className="l-sh-cols">
                {lebanonMeetings.map((meeting) => (
                  <MeetingComponent
                    venue={meeting.venueName}
                    address={meeting.address}
                    month={meeting.month}
                    day={meeting.day}
                    startTime={meeting.startTime}
                  />
                ))}
                </div>
                <div className="l-sh-cols">
                {sweethomeMeetings.map((meeting) => (
                  <MeetingComponent
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
