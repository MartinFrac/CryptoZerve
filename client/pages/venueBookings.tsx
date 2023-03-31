import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { NextPage } from "next";
import { BookingData } from "./api/bookings/index";
import VenueBooking from "../components/VenueBooking";
import { useRouter } from "next/router";

const VenueBookings: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [venueBookingsList, setVenueBookingsList] = useState<BookingData[]>([]);
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { venueID } = router.query;

  useEffect(() => {
    if (user === null) {
      alert("Your wallet is not connected");
      return;
    }
    fetch(`/api/bookings/venue/${venueID}`)
      .then((res) => res.json())
      .then((data) => {
        setVenueBookingsList(data);
      });
  }, []);

  const venueBookingsComponent = venueBookingsList.filter(b => b.isConfirmed === isConfirmed).map((item) => {
    return <VenueBooking key={item.id} details={item} />;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center items-center gap-4">
        <h1 className="text-[2rem] font-bold text-gray-700">Venue Bookings</h1>
        <div onClick={() => setIsConfirmed(prev => !prev)} className="bg-black text-white px-2 py-2 rounded-sm cursor-pointer">{isConfirmed ? 'Confirmed' : 'Not Confirmed'}</div>
      </div>
      <div className="grid grid-cols-3 gap-4">{venueBookingsComponent}</div>
    </div>
  );
};

export default VenueBookings;
