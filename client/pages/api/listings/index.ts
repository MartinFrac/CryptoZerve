import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore"; 
import type { NextApiRequest, NextApiResponse } from "next";

export type Venue = {
  id: string,
  address: string;
  owner: string;
  name: string;
  description: string;
  price: number;
  venue: string;
  startDay: number;
  daysRule: string[];
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Venue[]>
) {
    console.log("api/listings: executed");
    let listings: Venue[] = [];
    try {
      const querySnapshot = await getDocs(collection(db, "booking_types"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        listings.push({
          id: doc.id,
          address: doc.data().address,
          owner: doc.data().owner,
          name: doc.data().name,
          description: doc.data().description,
          price: doc.data().price,
          venue: doc.data().venue,
          startDay: doc.data().startDay,
          daysRule: doc.data().daysRule,
          startHour: doc.data().startHour,
          endHour: doc.data().endHour,
          startMinute: doc.data().startMinute,
          endMinute: doc.data().endMinute,
        })
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  res.status(200).json(listings);
}
