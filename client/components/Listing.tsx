import React from "react";
import { Data } from "../pages/api/listings";
import VENUE_ABI from "../abi/Venue.json";
import { useMMContext } from "../context/MetamaskContext";
import { ethers } from "ethers";

type Props = {
  details: Data;
};

//TODO: invoke ask for booking
//TODO: invoke propose offer
//TODO: invoke book
const Listing: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;

  const request = async () => {
    if (user === null) {
      alert("Provider not injected");
      return;
    }
    const VenueContract = new ethers.Contract(
      "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
      VENUE_ABI,
      provider
    );
    const response = await VenueContract.checkOffers(); 
    console.log(response);
  };

  return (
    <div className="bg-slate-600 flex flex-col m-4 py-4 items-center">
      <div>{props.details.name}</div>
      <div>{props.details.description}</div>
      <div>{props.details.price.toString()}</div>
      <div>{props.details.venue}</div>
      <button onClick={request} className="bg-white max-w-md m-2">Ask for booking</button>
      <button className="bg-white max-w-md m-2">Propose offer</button>
      <button className="bg-white max-w-md m-2">Book</button>
    </div>
  );
};

export default Listing;
