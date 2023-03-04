import React, { useEffect, useState } from "react";
import Time from "../Activity/Time";
import DaysOfWeekSelector from "./DaysOfWeekSelector";

type Props = {
  setRules: (
    daysRule: number,
    slotsRule: number,
    start: number[],
    end: number[]
  ) => void;
};

type Time = {
  hour: number;
  minute: number;
};

const SlotsConverter: React.FC<Props> = ({ setRules }) => {
  const [timeStart, setTimeStart] = useState<Time>({ hour: 0, minute: 0 });
  const [timeEnd, setTimeEnd] = useState<Time>({ hour: 0, minute: 0 });
  const [daysList, setDaysList] = useState<string[]>([]);
  const [slotsRule, setSlotsRule] = useState<number>(0);
  const [daysRule, setDaysRule] = useState<number>(0);

  const setStartTime = (hour: number, minute: number) => {
    setTimeStart({ hour: hour, minute: minute });
  };

  useEffect(() => {
    let slotsRuleLocal = 0;
    const startIndex = timeStart.hour * 2 + (timeStart.minute === 0 ? 0 : 1);
    const endIndex = timeEnd.hour * 2 + (timeEnd.minute === 0 ? 0 : 1);
    const sumOfIndexes = endIndex - startIndex;
    slotsRuleLocal = 2 ** sumOfIndexes - 1;
    slotsRuleLocal = slotsRuleLocal * 2 ** startIndex;
    setRules(
      daysRule,
      slotsRuleLocal,
      [timeStart.hour, timeStart.minute],
      [timeEnd.hour, timeEnd.minute]
    );
    console.log(slotsRuleLocal.toString(2));
  }, [timeStart, timeEnd]);

  useEffect(() => {
    //convert dayslist to rule
    console.log(daysList)
  }, [daysList])

  const setEndTime = (hour: number, minute: number) => {
    setTimeEnd({ hour: hour, minute: minute });
  };

  const setDays = (daysList: string[]) => {
    setDaysList(daysList);
  };

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
      <DaysOfWeekSelector setDays={setDays} />
    </div>
  );
};

export default SlotsConverter;
