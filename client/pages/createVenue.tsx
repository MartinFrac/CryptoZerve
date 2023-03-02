import { NextPage } from "next";
import React from "react";
import { useMMContext } from "../context/MetamaskContext";
import { ContractFactory } from "ethers";
import VENUE_ABI from "../abi/VenueSlots.json";
import VENUE_BYTECODE from "../bytecode/VenueSlots.json";

const createVenue: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const provider = mmContext.provider;

  const create = async () => {
    const signer = provider.getSigner();
    // The factory we use for deploying contracts
    const factory = new ContractFactory(VENUE_ABI, VENUE_BYTECODE, signer);
    // Deploy an instance of the contract
    const contract = await factory.deploy(
      "createvenue",
      "33.454, 43.4325",
      3,
      2023,
      0b110011,
      0b111100001111,
      30,
      5000,
      { value: 20_000 }
    );
    console.log(contract.address);
    // The transaction that the signer sent to deploy
    await contract.deployTransaction.wait();
    const name = await contract.name();
    console.log(name);
    const venueObject = {
      name: "namet",
      description: "desct",
      owner: "ownert",
      price: 5000,
      startDay: 1,
      venue: "venuet",
    }

    //TODO: test that db gets venue added when contract created
    fetch(`/api/myBookingTypes/${user}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: contract.address,
        ...venueObject,
      }),
    });
  };

  return <button onClick={() => create()}>create venue</button>;
};

export default createVenue;
