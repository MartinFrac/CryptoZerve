import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Listing from "../components/Listing";
import { Data } from "./api/listings";
import { useFiltersContext } from "../context/FiltersContext";

const Listings: NextPage = () => {
  const [listings, setListings] = useState<Data[]>([]);
  const filtersContext = useFiltersContext();

  useEffect(() => {
    console.log(filtersContext.filters)
    fetch(`/api/listings/${filtersContext.filters.name}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
      });
  }, []);

  const listingsComponent = listings.map(item => {
    return <Listing key={item.id} details={item} />
  })

  return (
    <div className="text-center">
      <div className="flex flex-row gap-[4rem]">
        <div className="flex flex-col justify-start flex-1">
          {listingsComponent}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default Listings;
