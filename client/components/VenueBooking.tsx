import React, { useState } from "react";
import { MyBookingData } from "../pages/api/bookings/[user]";
import { useMMContext } from "../context/MetamaskContext";
import VENUE_ABI from "../abi/VenueSlots.json";
import { ethers } from "ethers";
import { VenueBookingData } from "../pages/api/bookings/venue/[address]";
import { Venue } from "../pages/api/listings";

type Props = {
  details: VenueBookingData;
};

const VenueBooking: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const [pinInput, setPinInput] = useState<number>(0);
  const [addressEndInput, setAddressEndInput] = useState<string>("");

  const getDayOfYear = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff =
      date.getTime() -
      startOfYear.getTime() +
      (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
  };

  const getVenue = (bookingTypeID: string) => {
    fetch(`/api/listings/${bookingTypeID}`)
      .then((res) => res.json())
      .then((data) => {
        return data as Venue;
      });
    return {} as Venue;
  };

  const cancel = async () => {
    if (user === null) {
      alert("Provider not injected");
      return;
    }
    const signer = provider.getSigner();
    const VenueContract = new ethers.Contract(
      props.details.id,
      VENUE_ABI,
      provider
    );
    try {
      const bookingType = getVenue(props.details.bookingTypeID);
      const pin = pinInput;
      const dayOfTheYear = getDayOfYear(new Date());
      const day = dayOfTheYear - bookingType.startDay + 1;
      const addressEnd = addressEndInput;
      const VenueContractWithSigner = VenueContract.connect(signer);
      const response = await VenueContractWithSigner.cofirmAttendance(
        day,
        addressEnd,
        pin
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
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
      <div>Units: {props.details.units}</div>
      <input
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        id="price"
        value={pinInput}
        onChange={(event) => setPinInput(parseInt(event.target.value))}
      />
      <input
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        id="price"
        value={addressEndInput}
        onChange={(event) => setAddressEndInput(event.target.value)}
      />
      <button
        onClick={() => cancel()}
        className="bg-white max-w-md px-2 py-2 mt-2 text-black"
      >
        Confirm
      </button>
    </div>
  );
};

export default VenueBooking;
