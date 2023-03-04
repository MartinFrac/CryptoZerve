import React, { useState } from "react";
import Time from "../Activity/Time";
import DaysOfWeekSelector from "./DaysOfWeekSelector";

type Props = {
  setRules: (daysRule: number, slotsRule: number) => void;
}

const SlotsConverter: React.FC<Props> = ({ setRules }) => {
  const [timeStart, setTimeStart] = useState({ hour: 0, minute: 0 });
  const [timeEnd, setTimeEnd] = useState({ hour: 0, minute: 0 });

  const setStartTime = () => {

  }

  const setEndTime = () => {

  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <label>
        Start time:
        <Time setTime={setStartTime} />
      </label>
      <label>
        End time:
        <Time setTime={setEndTime} />
      </label>
      <DaysOfWeekSelector />
    </div>
  );
};

export default SlotsConverter;
