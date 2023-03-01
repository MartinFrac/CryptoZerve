import { db } from "../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export type MyBookingData = {
  id: string;
  bookingTypeID: string;
  day: string;
  hourEnd: number;
  hourStart: number;
  minuteEnd: number;
  minuteStart: number;
  name: string;
  pin: number;
  units: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyBookingData[]>
) {
  //TODO: update to search by user 
  console.log("api/mybookings: executed");
  if (req.method === "POST") {
    try {
      const docRef = await addDoc(collection(db, "myBookings"), req.body);
      console.log(`document added: ${docRef}`)
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  let bookings: MyBookingData[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "myBookings"));
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
