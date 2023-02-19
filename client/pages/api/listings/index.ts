import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore"; 
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  id: string,
  address: string;
  owner: string;
  name: string;
  description: string;
  price: number;
  venue: string;
  startDay: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
    console.log("api/listings: executed");
    let listings: Data[] = [];
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
        })
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  res.status(200).json(listings);
}
