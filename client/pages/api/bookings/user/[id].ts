import { db } from "../../../../config/firebase";
import { FieldValue, addDoc, collection, doc, getDocs, setDoc, increment } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { BookingData } from "../.";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingData[]>
) {
  const { query } = req;
  const { id } = query;
  if (id === undefined) return;
  console.log(`api/bookings/${id}: executed`);

  if (req.method === "POST") {
    try {
      const myBookingsRef = await addDoc(collection(db, "bookings"), req.body);
      const venueRef = doc(db, "venues", req.body.venueID)
      await setDoc(venueRef, { coverage: increment(-req.body.payed) }, { merge: true })
      console.log(`documents added: ${myBookingsRef}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  let bookings: BookingData[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    querySnapshot.forEach((doc) => {
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
