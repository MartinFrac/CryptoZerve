import React from "react";
import SlotsConverter from "./SlotsConverter";
import DaysOfWeekSelector from "./DaysOfWeekSelector";

const Right = () => {
  const setDaysRuleLocal = () => {

  }

  const setSlotsRuleLocal = () => {

  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <SlotsConverter
        setDaysRule={setDaysRuleLocal}
        setSlotsRule={setSlotsRuleLocal}
      />
      <DaysOfWeekSelector />
    </div>
  );
};

export default Right;
