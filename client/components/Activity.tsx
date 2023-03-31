import React, { useEffect } from "react";
import Link from "next/link";
import { useFiltersContext } from "../context/FiltersContext";
import Time from "./Activity/Time";
import Units from "./Activity/Units";
import Calendar from "./Activity/Calendar";

const Activity = () => {
  const filtersContext = useFiltersContext();
  const setFilters = filtersContext.setFilters;
  const filters = filtersContext.filters;

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const setName = (name: string) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      name: name,
    }));
  }

  const setDay = (date: Date) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      day: date,
    }));
  };

  const setUnits = (units: number) => {
    if (!setFilters) return;
    setFilters((prev) => ({
      ...prev,
      units: units,
    }));
  };

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

  const searchAndFilters = (
    <div className="px-6 py-6 flex flex-col">
      <div className="py-4 flex flex-row justify-evenly w-full">
        <div>Activity:</div>
        <input
          className="border-2 border-black rounded-md"
          type="text"
          value={filters.name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex flex-row justify-center">
        <div className="px-2 flex flex-col gap-4 items-start">
          <label>
            Start time:
            <Time startHour={filters.hourStart} startMinute={filters.minuteStart} setTime={setStartTime} />
          </label>
          <label>
            End time:
            <Time startHour={filters.hourEnd} startMinute={filters.minuteEnd} setTime={setEndTime} />
          </label>
          <Units startUnits={filters.units} onSetUnits={setUnits} />
          <Link
            href={{
              pathname: "/listings",
              query: { name: filters.name },
            }}
          >
            <button className="px-4 py-4 bg-black rounded-md text-white hover:bg-white hover:text-black border-2 border-black">Search</button>
          </Link>
        </div>
        <div className="px-2">
          <Calendar onSetDate={setDay} />
        </div>
      </div>
    </div>
  );
  const activityContainer = (
    <div className="m-6 rounded-lg bg-gray-200 border-black border-solid border-4 w-fit">{searchAndFilters}</div>
  );

  return activityContainer;
};

export default Activity;
