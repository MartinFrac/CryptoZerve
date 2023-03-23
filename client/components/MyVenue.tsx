import React from "react";
import { VenueData } from "../pages/api/venues";
import Link from "next/link";

type Props = {
  details: VenueData;
};

const MyVenue: React.FC<Props> = (props) => {
  return (
    <div className="bg-gray-200 max-w-xl flex flex-col m-4 px-4 py-4 items-start rounded text-gray-700 font-bold text-left">
      <div className="flex flex-row justify-between w-full">
        <div>{props.details.name}</div>
        <div>Price per slot: {props.details.priceInWei} wei</div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div>{props.details.location}</div>
        <div>Top up value: {props.details.coverage} wei</div>
      </div>
      <div>
        <span className="font-normal">{props.details.description}</span>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div></div>
        <Link
          href={{
            pathname: "/venueBookings",
            query: {
              venueID: props.details.id,
            },
          }}
        >
          <button className="bg-white max-w-md px-2 py-2 mt-2 text-black">
            Check Bookings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyVenue;
