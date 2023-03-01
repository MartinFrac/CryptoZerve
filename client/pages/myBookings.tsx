import React, { useEffect, useState } from 'react'
import { useMMContext } from '../context/MetamaskContext';
import { MyBookingData } from './api/bookings/[user]';
import MyBooking from '../components/MyBooking';

const myBookings = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingsList, setMyBookingsList] = useState<MyBookingData[]>([]);

  useEffect(() => {
    fetch(`/api/bookings/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setMyBookingsList(data);
      })
  }, []);

  const myBookingsComponent = myBookingsList.map(item => {
    return <MyBooking key={item.id} details={item} />
  })

  return (
    <div>
      {myBookingsComponent}
    </div>
  )
}

export default myBookings