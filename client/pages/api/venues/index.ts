import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export type VenueData = {
  id: string;
  contractAddress: string;
  coverage: number;
  daysRule: string[];
  description: string;
  endHour: number;
  endMinute: number;
  location: string;
  name: string;
  ownerAddress: string;
  priceInWei: number;
  startDay: number;
  startHour: number;
  startMinute: number;
  startYear: number;
  unitsPerSlot: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData[]>
) {
  console.log("api/listings: executed");
  let listings: VenueData[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "booking_types"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      listings.push({
        id: doc.id,
        contractAddress: doc.data().contractAddress,
        ownerAddress: doc.data().owner,
        name: doc.data().name,
        description: doc.data().description,
        priceInWei: doc.data().priceInWei,
        coverage: doc.data().coverage,
        unitsPerSlot: doc.data().unitsPerSlot,
        location: doc.data().location,
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
  res.status(200).json(listings);
}


