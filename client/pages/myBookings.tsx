import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { MyBookingData } from "./api/bookings";
import MyBooking from "../components/MyBooking";
import { NextPage } from "next";

const myBookings: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingsList, setMyBookingsList] = useState<MyBookingData[]>([]);

  useEffect(() => {
    if (user === null) {
      alert("Your wallet is not connected");
      return;
    }
    fetch(`/api/bookings/user/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setMyBookingsList(data);
      });
  }, []);

  const myBookingsComponent = myBookingsList.map((item) => {
    return <MyBooking key={item.id} details={item} />;
  });

  return <div>{myBookingsComponent}</div>;
};

export default myBookings;
