import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { useDispatch } from "react-redux";
import { openRsvpModal } from "../features/modal/showRsvpForm";
import { setMeetingToRsvp } from "../features/meetings/MeetingToRsvpSlice";

const MeetingComponent = ({ venue, address, month, day, startTime }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setMeetingToRsvp({ month: month, day: day, venue: venue }));
    dispatch(openRsvpModal());
  };

  return (
    <>
      <Card className="meeting-card">
        <CardHeader className="flex gap-3 px-5 pt-4 pb-3">
          <div className="flex flex-col gap-0.5 text-left">
            <p className="meeting-venue">{venue}</p>
            <p className="date-time">
              {month} {day}, 2025 &middot; {startTime}
            </p>
          </div>
        </CardHeader>
        <Divider className="meeting-divider" />
        <CardBody className="px-5 py-3">
          <p className="address">{address}</p>
        </CardBody>
        <Divider className="meeting-divider" />
        <CardFooter className="flex justify-start px-5 py-3">
          <ButtonComponent
            text="RSVP"
            styling="bg-accent px-6"
            onPress={() => handleClick()}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default MeetingComponent;
