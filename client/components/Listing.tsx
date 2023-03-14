import React from "react";
import { VenueData } from "../pages/api/venues";
import VENUE_ABI from "../abi/VenueSlots.json";
import { useMMContext } from "../context/MetamaskContext";
import { ethers } from "ethers";
import { useFiltersContext } from "../context/FiltersContext";

type Props = {
  details: VenueData;
};

const Listing: React.FC<Props> = (props) => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const filtersContext = useFiltersContext();
  const { filters } = filtersContext;

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

  const request = async () => {
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
      const pin = Math.floor(Math.random() * 10_000) + 1;
      const dayOfTheYear = getDayOfYear(filters.day);
      const day = dayOfTheYear - props.details.startDay + 1;
      const convertMinutesStart = filters.minuteStart == 0 ? 0 : 1;
      const convertMinutesEnd = filters.minuteEnd == 0 ? 0 : 1;
      const slotsStart = filters.hourStart * 2 + convertMinutesStart + 1;
      const slotsEnd = filters.hourEnd * 2 + convertMinutesEnd;
      const nOSlots = slotsEnd - slotsStart + 1;
      const cost = props.details.priceInWei * filters.units * nOSlots;
      console.log(filters);
      console.log(
        `pin: ${pin}, day: ${day}, ss:${slotsStart}, se: ${slotsEnd}, cost: ${cost}`
      );
      const VenueContractWithSigner = VenueContract.connect(signer);
      const response = await VenueContractWithSigner.book(
        day,
        slotsStart,
        slotsEnd,
        filters.units,
        pin,
        {
          value: cost,
          from: user,
        }
      );
      console.log(response);
      fetch(`/api/bookings/user/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueID: props.details.id,
          day: filters.day.toDateString(),
          endHour: filters.hourEnd,
          startHour: filters.hourStart,
          endMinute: filters.minuteStart,
          startMinute: filters.minuteStart,
          pin: pin + 1,
          units: filters.units,
          userAddress: user,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-600 flex flex-col m-4 px-4 py-4 items-start rounded text-white">
      <div>Name: {props.details.name}</div>
      <div>Description: {props.details.description}</div>
      <div>Price: {props.details.priceInWei.toString()}</div>
      <div>Venue: {props.details.location}</div>
      <button
        onClick={() => request()}
        className="bg-white max-w-md px-2 py-2 mt-2 text-black"
      >
        Book
      </button>
    </div>
  );
};

export default Listing;
