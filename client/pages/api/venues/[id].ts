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
    const docSnap = await getDoc(doc(db, "bookings", id.toString()));
    if (docSnap.exists()) {
      res.status(200).json({
        id: docSnap.id,
        contractAddress: docSnap.data().address,
        ownerAddress: docSnap.data().owner,
        name: docSnap.data().name,
        description: docSnap.data().description,
        priceInWei: docSnap.data().price,
        coverage: docSnap.data().topUp,
        unitsPerSlot: docSnap.data().price,
        location: docSnap.data().venue,
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