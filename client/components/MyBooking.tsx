import React from "react";
import { BookingData } from "../pages/api/bookings";

type Props = {
  details: BookingData;
};

const MyBooking: React.FC<Props> = (props) => {
  return (
    <div className="bg-gray-200 w-96 flex flex-col m-4 px-4 py-4 items-start rounded text-gray-700 font-bold text-left">
      <div className="flex flex-row justify-between w-full">
        <div>{props.details.name}</div>
        <div>{props.details.day}</div>
      </div>
      <div>
        Time start: {props.details.startHour.toString().padStart(2, "0")}:
        {props.details.startMinute.toString().padEnd(2, "0")}
      </div>
      <div>
        Time end: {props.details.endHour.toString().padStart(2, "0")}:
        {props.details.endMinute.toString().padEnd(2, "0")}
      </div>
      <div>Pin: {props.details.pin}</div>
      <div>Units: {props.details.units}</div>
      <div>Is Confirmed: {props.details.isConfirmed ? "Yes" : "No"}</div>
    </div>
  );
};

export default MyBooking;
