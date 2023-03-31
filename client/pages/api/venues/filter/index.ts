import { db } from "../../../../config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { VenueData } from "..";
import { Filters } from "../../../../context/FiltersContext";
import { getSlotNumber, weekList } from "../../../../utils/dates";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VenueData[]>
) {
  console.log("api/venues/filter: executed");
  let listings: VenueData[] = [];
  const filters = req.body as Filters;
  try {
    const dayOfWeek = weekList[new Date(filters.day).getDay()];
    //filter on time
    const startHourWhere = where("startHour", "<=", filters.hourStart);
    //filter on day
    const daysRuleWhere = where("daysRule", "array-contains", dayOfWeek);
    const daysRuleOrder = orderBy("startHour");
    const collectionRef = collection(db, "venues");
    const qStart = query(
      collectionRef,
      daysRuleWhere,
      startHourWhere,
      daysRuleOrder
    );
    const querySnapshotStart = await getDocs(qStart);
    querySnapshotStart.forEach((doc) => {
      //check if name exists && if name is matched
      if (filters.name !== "" && doc.data().name !== filters.name) return;
      if (doc.data().endHour < filters.hourEnd) return;
      //calculate cost
      const startSlot = getSlotNumber(filters.hourStart, filters.minuteStart);
      const endSlot = getSlotNumber(filters.hourEnd, filters.minuteEnd);
      const nOSlots = endSlot - startSlot;
      const cost = doc.data().priceInWei * filters.units * nOSlots;
      if (cost > doc.data().coverage) return;
      listings.push({
        id: doc.id,
        contractAddress: doc.data().contractAddress,
        ownerAddress: doc.data().ownerAddress,
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
