import React, { useState } from "react";
import Time from "../Activity/Time";

type Props = {
  setDaysRule: (rule: number) => void;
  setSlotsRule: (rule: number) => void;
}

const SlotsConverter: React.FC<Props> = ({ setDaysRule, setSlotsRule }) => {
  const [timeStart, setTimeStart] = useState({ hour: 0, minute: 0 });
  const [timeEnd, setTimeEnd] = useState({ hour: 0, minute: 0 });

  const setStartTime = () => {

    //convert
    convertSlots();
  }

  const setEndTime = () => {

    //convert
    convertSlots();
  }

  const convertDays = () => {
    setDaysRule(0b01);
  };

  const convertSlots = () => {
    setSlotsRule(0b01);
  };

  //TODO: add select with days of the week
  return (
    <div>
      <label>
        Start time:
        <Time setTime={setStartTime} />
      </label>
      <label>
        End time:
        <Time setTime={setEndTime} />
      </label>
    </div>
  );
};

export default SlotsConverter;
