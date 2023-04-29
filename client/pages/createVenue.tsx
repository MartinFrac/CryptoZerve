import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { BigNumber, ContractFactory } from "ethers";
import VENUE_ABI from "../abi/VenueSlots.json";
import VENUE_BYTECODE from "../bytecode/VenueSlots.json";
import Inputs from "../components/CreateVenue/Inputs";
import { VenueData } from "./api/venues";
import RulesComponent from "../components/CreateVenue/RulesComponent";

const createVenue: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const [venueObject, setVenueObject] = useState<VenueData>({
    id: "",
    contractAddress: "",
    ownerAddress: "",
    name: "",
    description: "",
    priceInWei: 0,
    coverage: 0,
    unitsPerSlot: 0,
    location: "",
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
      unitsPerSlot: units,
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
    try {
      const signer = provider.getSigner();
      const factory = new ContractFactory(VENUE_ABI, VENUE_BYTECODE, signer);
      const contract = await factory.deploy(
        venueObject.name,
        venueObject.location,
        venueObject.startDay,
        currentYear,
        daysRule.toBigInt(),
        slotsRule,
        venueObject.unitsPerSlot,
        venueObject.priceInWei,
        { value: venueObject.coverage }
      );
      console.log(contract.address);
      alert(`${venueObject.name} listed`);
      await contract.deployTransaction.wait();

      fetch(`/api/venues/user/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress: contract.address,
          ownerAddress: user,
          description: venueObject.description,
          name: venueObject.name,
          priceInWei: venueObject.priceInWei,
          coverage: venueObject.coverage,
          unitsPerSlot: venueObject.unitsPerSlot,
          startDay: venueObject.startDay,
          startYear: venueObject.startYear,
          location: venueObject.location,
          daysRule: venueObject.daysRule,
          startHour: venueObject.startHour,
          endHour: venueObject.endHour,
          startMinute: venueObject.startMinute,
          endMinute: venueObject.endMinute,
        }),
      });
    } catch (err: any) {
      alert("enter all the values");
      console.log(err);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center">
      <h1 className="text-[2rem] font-bold text-gray-700">List your venue</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-8 bg-gray-200 rounded-lg overflow-hidden shadow-md"
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
    </div>
  );
};

export default createVenue;
