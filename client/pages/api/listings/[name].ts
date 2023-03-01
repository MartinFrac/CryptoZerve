import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore"; 
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  id: string,
  address: string;
  owner: string;
  name: string;
  description: string;
  price: Number;
  venue: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
    const { query } = req;
    const { name } = query;
    console.log(`api/listings/${name}: executed`);
    let listings: Data[] = [];
    try {
      const querySnapshot = await getDocs(collection(db, "booking_types"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        if (doc.data().name!=name) return;
        listings.push({
          id: doc.id,
          address: doc.data().address,
          owner: doc.data().owner,
          name: doc.data().name,
          description: doc.data().description,
          price: doc.data().price,
          venue: doc.data().venue,
        })
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  res.status(200).json(listings);
}
