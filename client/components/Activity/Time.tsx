import React, { useState } from "react";
import { useFiltersContext } from "../../context/FiltersContext";

type Props = {
  setTime: (hour: number, minute: number) => void;
}

const Time: React.FC<Props> = ({ setTime }) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const handleHoursChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setHours(value);
    setTime(value, minutes);
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setMinutes(value);
    setTime(hours, value);
  };

  return (
    <div className="flex flex-row gap-4">
        <select value={hours} onChange={handleHoursChange}>
          {Array.from(Array(24).keys()).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <select value={minutes} onChange={handleMinutesChange}>
          <option value="0">0</option>
          <option value="30">30</option>
        </select>
    </div>
  );
}

export default Time;
