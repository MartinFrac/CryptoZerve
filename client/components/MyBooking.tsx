import React from "react";
import { BookingData } from "../pages/api/bookings";

type Props = {
  details: BookingData;
};

const MyBooking: React.FC<Props> = (props) => {

  return (
    <div className="bg-slate-600 flex flex-col m-4 px-4 py-4 items-start rounded text-white">
      <div>Name: {props.details.name}</div>
      <div>Description: {props.details.day}</div>
      <div>
        Time start: {props.details.startHour.toString().padStart(2, "0")}:{props.details.startMinute.toString().padEnd(2, "0")}
      </div>
      <div>
        Time end: {props.details.endHour.toString().padStart(2, "0")}:{props.details.endMinute.toString().padEnd(2, "0")}
      </div>
      <div>Pin: {props.details.pin}</div>
      <div>Units: {props.details.units}</div>
    </div>
  );
};

export default MyBooking;
