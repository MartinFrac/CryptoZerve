import { db } from "../../../../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { VenueData } from "./../index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData[]>
) {
  console.log("api/myBookingTypes: executed");
  const { query } = req;
  const { id } = query;
  let bookings: VenueData[] = [];

  if (req.method === "POST") {
    try {
      const bookingTypeRef = await addDoc(collection(db, "booking_types"), req.body);
      const docObject = { ID: bookingTypeRef.id };
      const myBookingTypeRef = await addDoc(
        collection(db, "myBookingTypes", `${id}`, "bookingTypes"),
        docObject
      );
      console.log(`documents added: ${bookingTypeRef}, ${myBookingTypeRef}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      return res.status(204);
    }
    return res.status(200);
  }

  try {
    const { query } = req;
    const { user } = query;
    if (!user) return;
    const collectionMyBookingTypes = collection(
      db,
      "myBookingTypes",
      user.toString(),
      "bookingTypes"
    );
    const myBTSnaps = await getDocs(collectionMyBookingTypes);
    const bookingTypesSnaps = await getDocs(collection(db, "booking_types"));
    bookingTypesSnaps.forEach((doc) => {
      if (!myBTSnaps.docs.find((d) => d.data().ID === doc.id)) return;
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      bookings.push({
        id: doc.id,
        address: doc.data().address,
        owner: doc.data().owner,
        name: doc.data().name,
        description: doc.data().description,
        price: doc.data().price,
        topUp: doc.data().topUp,
        venue: doc.data().venue,
        units: doc.data().units,
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
  res.status(200).json(bookings);
}
