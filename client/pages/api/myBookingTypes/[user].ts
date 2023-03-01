import { db } from "../../../config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { Data } from "../listings";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  console.log("api/myBookingTypes: executed");
  let bookings: Data[] = [];
  try {
    const { query } = req;
    const { user } = query;
    if (!user) return;
    const collectionMyBookingTypes = collection(db, 'myBookingTypes', user.toString(), 'bookingTypes');
    const myBTSnaps = await getDocs(collectionMyBookingTypes);
    const bookingTypesSnaps = await getDocs(collection(db, "booking_types"));
    bookingTypesSnaps.forEach((doc) => {
      if (!myBTSnaps.docs.find(d => d.data().ID === doc.id)) return;
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
