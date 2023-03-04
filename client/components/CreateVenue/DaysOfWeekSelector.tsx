import React, { useEffect, useState } from "react";

type Props = {
  setDays: (days: string[]) => void;
};

const WeekdaySelector: React.FC<Props> = ({ setDays }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    setDays(selectedDays);
  }, [selectedDays]);

  return (
    <div>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              value="Monday"
              checked={selectedDays.includes("Monday")}
              onChange={() => handleDaySelect("Monday")}
            />
            Monday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Tuesday"
              checked={selectedDays.includes("Tuesday")}
              onChange={() => handleDaySelect("Tuesday")}
            />
            Tuesday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Wednesday"
              checked={selectedDays.includes("Wednesday")}
              onChange={() => handleDaySelect("Wednesday")}
            />
            Wednesday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Thursday"
              checked={selectedDays.includes("Thursday")}
              onChange={() => handleDaySelect("Thursday")}
            />
            Thursday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Friday"
              checked={selectedDays.includes("Friday")}
              onChange={() => handleDaySelect("Friday")}
            />
            Friday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Saturday"
              checked={selectedDays.includes("Saturday")}
              onChange={() => handleDaySelect("Saturday")}
            />
            Saturday
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              value="Sunday"
              checked={selectedDays.includes("Sunday")}
              onChange={() => handleDaySelect("Sunday")}
            />
            Sunday
          </label>
        </li>
      </ul>
    </div>
  );
};

export default WeekdaySelector;
