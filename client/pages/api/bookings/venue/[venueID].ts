import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { BookingData } from "..";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingData[]>
) {
  const { venueID } = req.query;
  if (venueID === undefined) return;
  console.log(`api/bookings/venue/${venueID}: executed`);

  if (req.method === "POST") {
    try {
      const docRef = await addDoc(collection(db, "venues"), req.body);
      console.log(`document added: ${docRef}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  let bookings: BookingData[] = [];
  try {
    const collectionRef = collection(db, "bookings");
    const q = query(collectionRef, where("venueID", "==", venueID));
    const venuesSnapshot = await getDocs(q);
    venuesSnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      bookings.push({
        id: doc.id,
        venueID: doc.data().venueID,
        userAddress: doc.data().userAddress,
        isConfirmed: doc.data().isConfirmed,
        payed: doc.data().payed,
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
