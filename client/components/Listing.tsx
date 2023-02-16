import React, { useState } from "react";
import { Data } from "../pages/api/listings";
import VENUE_ABI from "../abi/VenueSlots.json";
import { useMMContext } from "../context/MetamaskContext";
import { ethers } from "ethers";

type Props = {
  details: Data;
};



const Listing: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;

  const request = async () => {
    if (user === null) {
      alert("Provider not injected");
      return;
    }
    const signer = provider.getSigner();
    const VenueContract = new ethers.Contract(
      props.details.address,
      VENUE_ABI,
      provider
    );
    try {
      const VenueContractWithSigner = VenueContract.connect(signer);
      const response = await VenueContractWithSigner.book(6, 6, 6, 1, 1, {
        value: 5000,
        from: user
      });
      // const call = await VenueContract["getBookings()"]({ from: user });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-600 flex flex-col m-4 py-4 items-center">
      <div>{props.details.name}</div>
      <div>{props.details.description}</div>
      <div>{props.details.price.toString()}</div>
      <div>{props.details.venue}</div>
      <button onClick={() => request()} className="bg-white max-w-md m-2">
        Book
      </button>
    </div>
  );
};

export default Listing;
