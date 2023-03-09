import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("api/myBookingTypes: executed");
  const { query } = req;
  const { booking } = query;

  try {
    const bookingTypeRef = await addDoc(collection(db, "booking_types"), req.body);
    const docObject = { ID: bookingTypeRef.id };
    const myBookingTypeRef = await addDoc(
      collection(db, "myBookingTypes", `${booking}`, "bookingTypes"),
      docObject
    );
    console.log(`documents added: ${bookingTypeRef}, ${myBookingTypeRef}`);
  } catch (error) {
    console.error("Error adding document: ", error);
    return res.status(204);
  }
  return res.status(200);
}
