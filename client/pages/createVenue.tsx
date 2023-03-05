import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { BigNumber, ContractFactory } from "ethers";
import VENUE_ABI from "../abi/VenueSlots.json";
import VENUE_BYTECODE from "../bytecode/VenueSlots.json";
import Inputs from "../components/CreateVenue/Inputs";
import { Venue } from "./api/listings";
import RulesComponent from "../components/CreateVenue/RulesComponent";

const createVenue: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const [venueObject, setVenueObject] = useState<Venue>({
    id: "",
    address: "",
    owner: "",
    name: "",
    description: "",
    price: 0,
    topUp: 0,
    units: 0,
    venue: "",
    startDay: 0,
    startYear: new Date().getFullYear(),
    daysRule: [],
    startHour: 0,
    endHour: 0,
    startMinute: 0,
    endMinute: 0,
  });
  const [slotsRule, setSlotsRule] = useState<number>(0);
  const [daysRule, setDaysRule] = useState<BigNumber>(BigNumber.from(0));
  useEffect(() => {
    console.log(venueObject);
  }, [venueObject]);

  const setRules = (
    daysRule: BigNumber,
    slotsRule: number,
    start: number[],
    end: number[],
    startDay: number,
    startYear: number,
    days: string[],
    units: number
  ) => {
    setDaysRule(daysRule);
    setSlotsRule(slotsRule);
    setVenueObject((prev) => ({
      ...prev,
      units: units,
      startHour: start[0],
      startMinute: start[1],
      endHour: end[0],
      endMinute: end[1],
      daysRule: days,
      startDay: startDay,
      startYear: startYear,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(
      `create venue: slots rule: ${slotsRule}, days rule: ${daysRule
        .toBigInt()
        .toString(2)}`
    );
    if (user === null) {
      alert("Your wallet is not connected");
      return;
    }
    const currentYear = new Date().getFullYear();
    const signer = provider.getSigner();
    const factory = new ContractFactory(VENUE_ABI, VENUE_BYTECODE, signer);
    const contract = await factory.deploy(
      venueObject.name,
      venueObject.venue,
      venueObject.startDay,
      currentYear,
      daysRule.toBigInt(),
      slotsRule,
      venueObject.units,
      venueObject.price,
      { value: venueObject.topUp }
    );
    console.log(contract.address);
    await contract.deployTransaction.wait();

    fetch(`/api/myBookingTypes/${user}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: contract.address,
        owner: user,
        description: venueObject.description,
        name: venueObject.name,
        price: venueObject.price,
        topUp: venueObject.topUp,
        units: venueObject.units,
        startDay: venueObject.startDay,
        startYear: venueObject.startYear,
        venue: venueObject.venue,
        daysRule: venueObject.daysRule,
        startHour: venueObject.startHour,
        endHour: venueObject.endHour,
        startMinute: venueObject.startMinute,
        endMinute: venueObject.endMinute,
      }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-8 bg-white rounded-lg overflow-hidden shadow-md"
    >
      <div>
        <div className="flex flex-row p-2">
          <Inputs venueObject={venueObject} setVenueObject={setVenueObject} />
          <RulesComponent setRules={setRules} />
        </div>
        <button
          type="submit"
          className="text-center w-full p-4 bg-black text-white"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default createVenue;