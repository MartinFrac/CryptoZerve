import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { BookingData } from "./api/bookings";
import MyBooking from "../components/MyBooking";
import { NextPage } from "next";

const myBookings: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingsList, setMyBookingsList] = useState<BookingData[]>([]);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

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

  const myBookingsComponent = myBookingsList
    .filter((b) => b.isConfirmed === isConfirmed)
    .map((item) => {
      return <MyBooking key={item.id} details={item} />;
    });

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center items-center gap-4">
        <h1 className="text-[2rem] font-bold text-gray-700">My Bookings</h1>
        <div
          onClick={() => setIsConfirmed((prev) => !prev)}
          className="bg-black text-white px-2 py-2 rounded-sm cursor-pointer"
        >
          {isConfirmed ? "Confirmed" : "Not Confirmed"}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">{myBookingsComponent}</div>
    </div>
  );
};

export default myBookings;
