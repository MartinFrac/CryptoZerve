import React, { useEffect } from "react";
import {Venue } from "../pages/api/listings";
import { useMMContext } from "../context/MetamaskContext";

type Props = {
  details: Venue;
};

const MyVenue: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  //TODO: on venue click get bookings to confirm
  useEffect(() => {
    fetch(`/api/myBookingTypes/${user}/`)
      .then((res) => res.json())
      .then();
  }, []);

  return (
    <div className="bg-slate-600 flex flex-col m-4 px-4 py-4 items-start rounded text-white">
      <div>Name: {props.details.name}</div>
      <div>Description: {props.details.description}</div>
      <div>Price: {props.details.price.toString()}</div>
      <div>Venue: {props.details.venue}</div>
      <button className="bg-white max-w-md px-2 py-2 mt-2 text-black">
        Book
      </button>
    </div>
  );
};

export default MyVenue;
