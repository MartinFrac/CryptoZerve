import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { VenueData } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData>
) {
  const { query } = req;
  const { id } = query;
  console.log(`api/listings/${id}: executed`);
  if (id === undefined) return;
  try {
    const docSnap = await getDoc(doc(db, "booking_types", id.toString()));
    if (docSnap.exists()) {
      res.status(200).json({
        id: docSnap.id,
        address: docSnap.data().address,
        owner: docSnap.data().owner,
        name: docSnap.data().name,
        description: docSnap.data().description,
        price: docSnap.data().price,
        topUp: docSnap.data().topUp,
        units: docSnap.data().price,
        venue: docSnap.data().venue,
        startDay: docSnap.data().startDay,
        startYear: docSnap.data().startYear,
        daysRule: docSnap.data().daysRule,
        startHour: docSnap.data().startHour,
        endHour: docSnap.data().endHour,
        startMinute: docSnap.data().startMinute,
        endMinute: docSnap.data().endMinute,
      });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  res.status(200);
}