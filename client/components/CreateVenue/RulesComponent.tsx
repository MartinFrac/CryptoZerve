import React, { useEffect, useState } from "react";
import Time from "../Activity/Time";
import DaysOfWeekSelector from "./DaysOfWeekSelector";
import { BigNumber } from "ethers";

type Props = {
  setRules: (
    daysRule: BigNumber,
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
  const [daysRule, setDaysRule] = useState<BigNumber>(BigNumber.from(0));

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
    //get date => calendar
    //get date of the year
    //offset days rule to fit start day i.e. 4 = Tuesday => 0000010 => 0000001
    let daysRuleTemplate = 0;
    if (daysList.includes('Monday')) daysRuleTemplate += 1;
    if (daysList.includes('Tuesday')) daysRuleTemplate += 2;
    if (daysList.includes('Wednesday')) daysRuleTemplate += 4;
    if (daysList.includes('Thursday')) daysRuleTemplate += 8;
    if (daysList.includes('Friday')) daysRuleTemplate += 16;
    if (daysList.includes('Saturday')) daysRuleTemplate += 32;
    if (daysList.includes('Sunday')) daysRuleTemplate += 64;
    let daysRuleLocal = BigNumber.from(daysRuleTemplate);
    for (let i = 1; i < 30; i++) {
      //rule += template * 2 ** (7*i)
      const enhancer = BigNumber.from(7*i);
      const powerer = BigNumber.from(2).pow(enhancer);
      const template = BigNumber.from(daysRuleTemplate);
      const sum = template.mul(powerer);
      daysRuleLocal = daysRuleLocal.add(sum);
    }
    setDaysRule(daysRuleLocal);
    console.log(`list: ${daysList}, rule: ${daysRuleLocal.toBigInt().toString(2)}`)
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
