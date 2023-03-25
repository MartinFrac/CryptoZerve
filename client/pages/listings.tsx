import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Listing from "../components/Listing";
import { VenueData } from "./api/venues";
import { useFiltersContext } from "../context/FiltersContext";

const Listings: NextPage = () => {
  const [listings, setListings] = useState<VenueData[]>([]);
  const filtersContext = useFiltersContext();
  const filters = filtersContext.filters;

  useEffect(() => {
    console.log(filtersContext.filters);
    fetch(`/api/venues/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: filters.name,
        units: filters.units,
        day: filters.day,
        hourStart: filters.hourStart,
        hourEnd: filters.hourEnd,
        minuteEnd: filters.minuteStart,
        minuteStart: filters.minuteStart,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
      });
  }, []);

  const listingsComponent = listings.map((item) => {
    return <Listing key={item.id} details={item} />;
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[2rem] font-bold text-gray-700">Listings</h1>
      <div className="grid grid-cols-2 gap-4">{listingsComponent}</div>
    </div>
  );
};

export default Listings;
