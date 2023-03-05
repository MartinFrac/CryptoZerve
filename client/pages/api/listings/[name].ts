import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { Venue } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Venue[]>
) {
  const { query } = req;
  const { name } = query;
  console.log(`api/listings/${name}: executed`);
  let listings: Venue[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "booking_types"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      if (doc.data().name != name) return;
      listings.push({
        id: doc.id,
        address: doc.data().address,
        owner: doc.data().owner,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        topUp: doc.data().topUp,
        units: doc.data().price,
        venue: doc.data().venue,
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
