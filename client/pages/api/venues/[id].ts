import { db } from "../../../config/firebase";
import { doc, getDoc, increment, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { VenueData } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData>
) {
  const { id } = req.query;
  if (id === undefined) return;
  console.log(`api/venues/${id}: executed`);

  if (req.method === "PUT") {
    try {
      const venueRef = doc(db, "venues", id.toString());
      await setDoc(
        venueRef,
        { coverage: increment(req.body.increment) },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  try {
    const docSnap = await getDoc(doc(db, "venues", id.toString()));
    if (docSnap.exists()) {
      console.log(docSnap.id);
      return res.status(200).json({
        id: docSnap.id,
        contractAddress: docSnap.data().contractAddress,
        ownerAddress: docSnap.data().ownerAddress,
        name: docSnap.data().name,
        description: docSnap.data().description,
        priceInWei: docSnap.data().priceInWei,
        coverage: docSnap.data().coverage,
        unitsPerSlot: docSnap.data().unitsPerSlot,
        location: docSnap.data().location,
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
  return res.status(204);
}
