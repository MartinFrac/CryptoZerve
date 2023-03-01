import React from "react";
import { MyBookingData } from "../pages/api/bookings/[user]";
import { useMMContext } from "../context/MetamaskContext";
import VENUE_ABI from "../abi/VenueSlots.json";
import { ethers } from "ethers";

type Props = {
  details: MyBookingData;
};

const MyBooking: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;

  const cancel = async () => {
    // if (user === null) {
    //   alert("Provider not injected");
    //   return;
    // }
    // const signer = provider.getSigner();
    // const VenueContract = new ethers.Contract(
    //   props.details.bookingTypeID,
    //   VENUE_ABI,
    //   provider
    // );
    // try {
    //   const VenueContractWithSigner = VenueContract.connect(signer);
    //   const response = await VenueContractWithSigner.cancel();
    //   console.log(response);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="bg-slate-600 flex flex-col m-4 px-4 py-4 items-start rounded text-white">
      <div>Name: {props.details.name}</div>
      <div>Description: {props.details.day}</div>
      <div>
        Time start: {props.details.hourStart}:{props.details.minuteStart}
      </div>
      <div>
        Time end: {props.details.hourEnd}:{props.details.minuteEnd}
      </div>
      <div>Pin: {props.details.pin}</div>
      <div>Units: {props.details.units}</div>
      <button
        onClick={() => cancel()}
        className="bg-white max-w-md px-2 py-2 mt-2 text-black"
      >
        Cancel
      </button>
    </div>
  );
};

export default MyBooking;
