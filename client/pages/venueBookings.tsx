import React, { useEffect, useState } from "react";
import { useMMContext } from "../context/MetamaskContext";
import { NextPage } from "next";
import { BookingData } from "./api/bookings/index";
import VenueBooking from "../components/VenueBooking";
import { useRouter } from "next/router";

const VenueBookings: NextPage = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [venueBookingsList, setVenueBookingsList] = useState<
    BookingData[]
  >([]);
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

  const myBookingsComponent = venueBookingsList.map((item) => {
    return <VenueBooking key={item.id} details={item} />;
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

export default VenueBookings;
