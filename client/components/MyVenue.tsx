import React from "react";
import { VenueData } from "../pages/api/venues";
import Link from "next/link";

type Props = {
  details: VenueData;
};

const MyVenue: React.FC<Props> = (props) => {
  return (
    <div className="bg-slate-600 flex flex-col m-4 px-4 py-4 items-start rounded text-white">
      <div>Name: {props.details.name}</div>
      <div>Location: {props.details.location}</div>
      <div>Description: {props.details.description}</div>
      <div>Price: {props.details.priceInWei}</div>
      <div>TopUp: {props.details.coverage}</div>
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
  );
};

export default MyVenue;
