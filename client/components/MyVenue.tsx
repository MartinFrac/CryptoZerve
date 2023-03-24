import React, { useState } from "react";
import { VenueData } from "../pages/api/venues";
import Link from "next/link";

type Props = {
  details: VenueData;
};

const MyVenue: React.FC<Props> = (props) => {
  const [topUp, setTopUp] = useState(0);

  const handleTopUp = () => {
    try {
      fetch(`/api/venues/${props.details.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          increment: topUp,
        }),
      });
    } catch (err) {
      alert("There was an error");
    }
  };

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
      <div className="flex flex-row justify-between h-full w-full">
        <div className="flex flex-col justify-end h-full">
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
        <div className="flex flex-col h-full justify-end max-w-[8rem] gap-1">
          <button
            className="bg-white max-w-md px-2 py-2 mt-2 text-black"
            onClick={handleTopUp}
          >
            Top-Up
          </button>
          <input
            type="number"
            value={topUp}
            onChange={(e) => setTopUp(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default MyVenue;
