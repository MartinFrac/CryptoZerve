import { db } from "../../../config/firebase";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { BookingData } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingData[]>
) {
  const { id } = req.query;
  if (id === undefined) return res.status(204);
  console.log(`api/bookings/${id}: executed`);

  if (req.method === "PUT") {
    try {
      const bookingRef = doc(db, "bookings", id.toString());
      setDoc(bookingRef, { ...req.body }, { merge: true });
    } catch (e) {
      console.error("Error adding document: ", e);
      return res.status(204);
    }
  }

  return res.status(204);
}
