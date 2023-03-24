import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { BookingData } from "./api/bookings";
import MyBooking from "../components/MyBooking";
import { NextPage } from "next";

const myBookings: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingsList, setMyBookingsList] = useState<BookingData[]>([]);

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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[2rem] font-bold text-gray-700">My Bookings</h1>
      <div className="grid grid-cols-3 gap-4">{myBookingsComponent}</div>
    </div>
  );
};

export default myBookings;
