import {Card, CardHeader, CardBody, CardFooter, Divider} from "@heroui/react";
import ButtonComponent from "./ButtonComponent";
import { useDispatch } from "react-redux";
import { openRsvpModal } from "../features/modal/showRsvpForm";
import { setMeetingToRsvp } from "../features/meetings/MeetingToRsvpSlice";

const MeetingComponent = ({ venue, address, month, day, startTime }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setMeetingToRsvp({ month: month, day: day, venue: venue }))
    dispatch(openRsvpModal())
  }


  return (
    <>
      <Card className="max-w-[600px] bg-main">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex flex-col justify-center">
            <p className="text-white">{venue}</p>
            <p className="date-time text-white text-md font-semibold">{month} {day}, 2025 - {startTime}</p>
          </div>
        </CardHeader>
        <Divider className="bg-white"/>
        <CardBody>
          <p className="address text-white text-center font-medium">{address}</p>
        </CardBody>
        <Divider className="bg-white"/>
        <CardFooter className="flex justify-center">
          <ButtonComponent text="RSVP" styling="bg-red text-white w-1/3" onPress={() => handleClick()}/>
        </CardFooter>
      </Card>
    </>
  );
};

export default MeetingComponent;