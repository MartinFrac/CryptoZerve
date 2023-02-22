import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { Data } from "./listings";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  console.log("api/myBookingTypes: executed");
  let bookings: Data[] = [];
  try {
    //TODO: get ref first from my booking types, then look for data in booking_types
    const querySnapshot = await getDocs(collection(db, "booking_types"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      bookings.push({
        id: doc.id,
        address: doc.data().address,
        owner: doc.data().owner,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        venue: doc.data().venue,
        startDay: doc.data().startDay,
      });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  res.status(200).json(bookings);
}