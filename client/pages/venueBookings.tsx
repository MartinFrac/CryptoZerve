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

  const venueBookingsComponent = venueBookingsList.map((item) => {
    return <VenueBooking key={item.id} details={item} />;
  });

  return <div className="grid grid-cols-3 gap-4">{venueBookingsComponent}</div>;
};

export default VenueBookings;
