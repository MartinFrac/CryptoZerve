import { NextPage } from "next";
import React, { useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { ContractFactory } from "ethers";
import VENUE_ABI from "../abi/VenueSlots.json";
import VENUE_BYTECODE from "../bytecode/VenueSlots.json";
import Left from "../components/CreateVenue/Left";
import Right from "../components/CreateVenue/Right";

const createVenue: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;
  const [venueObject, setVenueObject] = useState();
  const [daysRule, setDaysRule] = useState(0);
  const [slotsRule, setSlotsRule] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDay, setStartDay] = useState("");
  const [venue, setVenue] = useState("");

  const setDaysRuleLocal = (rule: number) => {
    setDaysRule(rule);
  };

  const setSlotsRuleLocal = (rule: number) => {
    setSlotsRule(rule);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentYear = new Date().getFullYear;
    const numberOfSlots = 0;
    const signer = provider.getSigner();
    const factory = new ContractFactory(VENUE_ABI, VENUE_BYTECODE, signer);
    const contract = await factory.deploy(
      name,
      venue,
      startDay,
      currentYear,
      0b110011,
      0b111100001111,
      numberOfSlots,
      parseInt(price),
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
        description: description,
        name: name,
        owner: user,
        price: parseInt(price),
        startDay: parseInt(startDay),
        venue: venue,
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
        <Left />
        <Right />
      </div>
    </form>
  );
};

export default createVenue;
