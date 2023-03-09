import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { MyBookingData } from "../.";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyBookingData[]>
) {
  const { query } = req;
  const { id } = query;
  if (id === undefined) return;
  console.log(`api/bookings/${id}: executed`);
  if (req.method === "POST") {
    try {
      const myBookingsRef = await addDoc(
        collection(db, "myBookings", id.toString(), "bookings"),
        req.body
      );
      const { pin, ...cutObject } = req.body;
      const venueBookingsRef = await addDoc(
        collection(db, "venueBookings", req.body.bookingTypeID, "bookings"),
        cutObject
      );
      console.log(`documents added: ${myBookingsRef}, ${venueBookingsRef}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  let bookings: MyBookingData[] = [];
  try {
    const querySnapshot = await getDocs(
      collection(db, "myBookings", id.toString(), "bookings")
    );
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      bookings.push({
        id: doc.id,
        bookingTypeID: doc.data().bookingTypeID,
        day: doc.data().day,
        hourEnd: doc.data().hourEnd,
        hourStart: doc.data().hourStart,
        minuteEnd: doc.data().minuteEnd,
        minuteStart: doc.data().minuteStart,
        name: doc.data().name,
        pin: doc.data().pin,
        units: doc.data().units,
      });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    return res.status(204);
  }
  res.status(200).json(bookings);
}
