import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { ContractFactory } from "ethers";
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
    venue: "",
    startDay: 0,
    daysRule: [],
    startHour: 0,
    endHour: 0,
    startMinute: 0,
    endMinute: 0,
  });
  const [slotsRule, setSlotsRule] = useState<number>(0);
  const [daysRule, setDaysRule] = useState<number>(0);
  useEffect(() => {
    console.log(venueObject);
  }, [venueObject]);

  const setRules = (daysRule: number, slotsRule: number, start: number[], end: number[]) => {};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentYear = new Date().getFullYear;
    const numberOfSlots = 0;
    const signer = provider.getSigner();
    const factory = new ContractFactory(VENUE_ABI, VENUE_BYTECODE, signer);
    const contract = await factory.deploy(
      venueObject.name,
      venueObject.venue,
      venueObject.startDay,
      currentYear,
      0b110011,
      0b111100001111,
      numberOfSlots,
      venueObject.price,
      { value: 20_000 }
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
        description: venueObject.description,
        name: venueObject.name,
        owner: user,
        price: venueObject.price,
        startDay: venueObject.startDay,
        venue: venueObject.venue,
        year: currentYear,
      }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white rounded-lg overflow-hidden shadow-md"
    >
      <div className="flex flex-row">
        <Inputs venueObject={venueObject} setVenueObject={setVenueObject} />
        <RulesComponent setRules={setRules} />
      </div>
    </form>
  );
};

export default createVenue;
