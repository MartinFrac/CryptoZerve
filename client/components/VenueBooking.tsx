import React, { useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import VENUE_ABI from "../abi/VenueSlots.json";
import { ethers } from "ethers";
import { BookingData } from "../pages/api/bookings/index";
import { VenueData } from "../pages/api/venues";

type Props = {
  details: BookingData;
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

  const getVenue = async (venueID: string): Promise<VenueData> => {
    try {
      const res = await fetch(`/api/venues/${venueID}`);
      const data = await res.json();
      return data as VenueData;
    } catch (err) {
      return {} as VenueData;
    }
  };

  const confirm = async () => {
    if (user === null) {
      alert("Provider not injected");
      return;
    }
    try {
      const venue = await getVenue(props.details.venueID);
      const signer = provider.getSigner();
      const VenueContract = new ethers.Contract(
        venue.contractAddress,
        VENUE_ABI,
        provider
      );
      console.log(venue);
      const pin = pinInput;
      const dayOfTheYear = getDayOfYear(new Date());
      const day = dayOfTheYear - venue.startDay + 1;
      const addressEnd = parseInt(addressEndInput, 16);
      const VenueContractWithSigner = VenueContract.connect(signer);
      console.log(day);
      console.log(addressEnd);
      console.log(pin);
      const response = await VenueContractWithSigner.confirmAttendance(
        day,
        addressEnd,
        pin
      );
      alert("Attendance confirmed");
      console.log(response);
      fetch(`/api/bookings/${props.details.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isConfirmed: true,
        }),
      });
    } catch (err: any) {
      alert("wrong reference");
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-200 max-w-xl flex flex-col m-4 px-4 py-4 items-start rounded text-gray-700 font-bold text-left">
      <div className="flex flex-row justify-between w-full text-lg">
        <div>{props.details.name}</div>
        <div>{props.details.day}</div>
      </div>
      <div className="flex flex-row w-full justify-between text-sm underline py-2">
        <div>
          {props.details.startHour.toString().padStart(2, "0")}:
          {props.details.startMinute.toString().padEnd(2, "0")}
          {" - " + props.details.endHour.toString().padStart(2, "0")}:
          {props.details.endMinute.toString().padEnd(2, "0")}
        </div>
        <div>Units: {props.details.units}</div>
      </div>
      <div className="bg-gray-500 flex flex-col px-4 py-4 rounded text-white">
        <label className="block font-bold mb-2" htmlFor="pin">
          PIN:
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="pin"
          value={pinInput}
          onChange={(event) => setPinInput(parseInt(event.target.value))}
        />
        <label className="block font-bold mb-2" htmlFor="addressEnd">
          Address End (2):
        </label>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="string"
          id="addressEnd"
          value={addressEndInput}
          onChange={(event) => setAddressEndInput(event.target.value)}
        />
        <button
          onClick={() => confirm()}
          className="bg-white max-w-md px-2 py-2 mt-2 text-black"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default VenueBooking;
