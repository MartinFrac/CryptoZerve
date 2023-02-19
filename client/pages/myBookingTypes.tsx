import React, { useEffect, useState } from 'react'
import { useMMContext } from '../context/MetamaskContext';
import MyBooking from '../components/MyBooking';
import { Data } from './api/listings';
import Listing from '../components/Listing';

const myBookingTypes = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;
  const [myBookingTypesList, setMyBookingTypesList] = useState<Data[]>([]);

  useEffect(() => {
    fetch(`/api/myBookings`)
      .then((res) => res.json())
      .then((data) => {
        setMyBookingTypesList(data);
      })
  }, []);

  const myBookingsComponent = myBookingTypesList.map(item => {
    return <Listing key={item.id} details={item} />
  })

  return (
    <div>
      {myBookingsComponent}
    </div>
  )
}

export default myBookingTypes