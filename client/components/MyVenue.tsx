import React, { useState } from "react";
import { VenueData } from "../pages/api/venues";
import Link from "next/link";
import { useMMContext } from "../context/MetamaskContext";
import VENUE_ABI from "../abi/VenueSlots.json";
import { ethers } from "ethers";

type Props = {
  details: VenueData;
};

const MyVenue: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const [topUp, setTopUp] = useState(0);

  const handleTopUp = async () => {
    if (user === null) {
      alert("Your wallet is not connected");
      return;
    }
    const signer = provider.getSigner();
    const VenueContract = new ethers.Contract(
      props.details.contractAddress,
      VENUE_ABI,
      provider
    );
    try {
      const VenueContractWithSigner = VenueContract.connect(signer);
      const response = await VenueContractWithSigner.topUp({ value: topUp });
      console.log(response);
      fetch(`/api/venues/${props.details.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          increment: topUp,
        }),
      });
      alert("top up successful");
    } catch (err) {
      alert("There was an error");
    }
  };

  return (
    <div className="bg-gray-200 max-w-xl flex flex-col m-4 px-4 py-4 items-start rounded text-gray-700 font-bold text-left">
      <div className="flex flex-row justify-between w-full text-lg gap-4">
        <div>{props.details.name}</div>
        <div>Price: {props.details.priceInWei} wei</div>
      </div>
      <div className="flex flex-row justify-between w-full text-sm py-2 underline">
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
