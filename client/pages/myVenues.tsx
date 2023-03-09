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
    <div className="text-center">
      <div className="flex flex-row gap-[4rem]">
        <div className="flex flex-col justify-start flex-1">
          {myBookingsComponent}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default myBookingTypes;
