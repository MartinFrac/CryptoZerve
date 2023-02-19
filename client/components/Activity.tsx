import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFiltersContext } from "../context/FiltersContext";
import Time from "./Activity/Time";
import Units from "./Activity/Units";
import Calendar from "./Activity/Calendar";

const Activity = () => {
  const [name, setName] = useState<string>("");
  const filtersContext = useFiltersContext();
  const setFilters = filtersContext.setFilters;
  const filters = filtersContext.filters;

  useEffect(() => {
    console.log(filters);
  }, [filters])

  const setUnits = (units: number) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      units: units,
    }));
  }

  const setStartTime = (hour: number, minutes: number) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      hourStart: hour,
      minuteStart: minutes,
    }));
  };

  const setEndTime = (hour: number, minutes: number) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      hourEnd: hour,
      minuteEnd: minutes,
    }));
  };

  return (
    <div className="m-12 rounded-2xl bg-blue-400 flex flex-col items-start px-4 py-4">
      <div className="flex flex-row justify-evenly w-full">
        <div>Activity:</div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex flex-row justify-center">
        <div className="px-2">
          <Calendar />
        </div>
        <div className="px-2">
          <Time setTime={setStartTime} />
          <Time setTime={setEndTime} />
        </div>
        <div className="px-2">
          <Units onSetUnits={setUnits} />
        </div>
        <Link
          href={{
            pathname: "/listings",
            query: { name: name },
          }}
        >
          <button className="px-4 py-4 bg-white">
            Search
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Activity;
