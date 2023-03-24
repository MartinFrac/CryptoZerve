import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { VenueData } from "./api/venues";
import MyVenue from "../components/MyVenue";
import { NextPage } from "next";

const myBookingTypes: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingTypesList, setMyBookingTypesList] = useState<VenueData[]>([]);

  useEffect(() => {
    fetch(`/api/venues/user/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setMyBookingTypesList(data);
      });
  }, []);

  const myBookingsComponent = myBookingTypesList.map((item) => {
    return <MyVenue key={item.id} details={item} />;
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[2rem] font-bold text-gray-700">My Venues</h1>
      <div className="grid grid-cols-3 gap-4">{myBookingsComponent}</div>
    </div>
  );
};

export default myBookingTypes;
