import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { VenueData } from "./../index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData[]>
) {
  const { id } = req.query;
  if (id === undefined) return res.status(204);
  console.log(`api/venues/user/${id}: executed`);

  if (req.method === "POST") {
    try {
      const venueRef = await addDoc(collection(db, "venues"), req.body);
      console.log(`document added: ${venueRef}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  let venues: VenueData[] = [];
  try {
    const venuesRef = collection(db, "venues");
    const q = query(venuesRef, where("ownerAddress", "==", id.toString()));
    const venueSnaps = await getDocs(q);
    venueSnaps.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      venues.push({
        id: doc.id,
        contractAddress: doc.data().contractAddress,
        ownerAddress: doc.data().ownerAddress,
        name: doc.data().name,
        description: doc.data().description,
        priceInWei: doc.data().priceInWei,
        coverage: doc.data().coverage,
        location: doc.data().location,
        unitsPerSlot: doc.data().unitsPerSlot,
        startDay: doc.data().startDay,
        startYear: doc.data().startYear,
        daysRule: doc.data().daysRule,
        startHour: doc.data().startHour,
        endHour: doc.data().endHour,
        startMinute: doc.data().startMinute,
        endMinute: doc.data().endMinute,
      });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  res.status(200).json(venues);
}
