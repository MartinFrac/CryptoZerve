import React from "react";
import { Data } from "../pages/api/listings";
import VENUE_ABI from "../abi/VenueSlots.json";
import { useMMContext } from "../context/MetamaskContext";
import { ethers } from "ethers";

type Props = {
  details: Data;
};

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
      "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B",
      VENUE_ABI,
      provider
    );
    const response = await VenueContract.name(); 
    console.log(response);
  };

  return (
    <div className="bg-slate-600 flex flex-col m-4 py-4 items-center">
      <div>{props.details.name}</div>
      <div>{props.details.description}</div>
      <div>{props.details.price.toString()}</div>
      <div>{props.details.venue}</div>
      <button onClick={() => request()} className="bg-white max-w-md m-2">Book</button>
    </div>
  );
};

export default Listing;
