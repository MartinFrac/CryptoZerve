import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { Venue } from "./api/listings";
import MyVenue from "../components/MyVenue";
import { NextPage } from "next";

const myBookingTypes: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingTypesList, setMyBookingTypesList] = useState<Venue[]>([]);

  useEffect(() => {
    fetch(`/api/myBookingTypes/${user}`)
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
