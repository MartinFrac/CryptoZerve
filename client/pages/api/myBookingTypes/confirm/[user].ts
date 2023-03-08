import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("api/myBookingTypes: executed");
  const { query } = req;
  const { user } = query;

  try {
    const btRef = await addDoc(collection(db, "booking_types"), req.body);
    const docObject = { ID: btRef.id };
    const mbtRef = await addDoc(
      collection(db, "myBookingTypes", `${user}`, "bookingTypes"),
      docObject
    );
    console.log(`document added: ${btRef}`);
  } catch (error) {
    console.error("Error adding document: ", error);
    return res.status(204);
  }
  return res.status(200);
}
