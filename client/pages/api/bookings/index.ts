import { db } from "../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export type BookingData = {
  id: string;
  venueID: string;
  userAddress: string;
  day: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  name: string;
  pin: number;
  units: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingData[]>
) {
  console.log("api/mybookings: executed");

  let bookings: BookingData[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "myBookings"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      bookings.push({
        id: doc.id,
        venueID: doc.data().venueID,
        userAddress: doc.data().userAddress,
        day: doc.data().day,
        startHour: doc.data().startHour,
        startMinute: doc.data().startMinute,
        endHour: doc.data().endHour,
        endMinute: doc.data().endMinute,
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
