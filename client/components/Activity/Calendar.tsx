import React, { useState } from "react";

type CalendarProps = {
  year?: number;
  month?: number;
  onSetDate: (day: Date) => void;
};

const Calendar: React.FC<CalendarProps> = ({
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  onSetDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(month);
  const [currentYear, setCurrentYear] = useState<number>(year);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  const days = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from(Array(daysInMonth).keys()),
  ];

  const handleDayClick = (day: number) => {
    const date = new Date(currentYear, currentMonth - 1, day);
    setSelectedDate(date);
    onSetDate(date);
  };

  const handlePrevMonthClick = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonthClick = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded px-4 py-4">
      <div className="flex flex-row justify-between">
        <button
          className="bg-black text-white px-2 py-2 rounded"
          onClick={handlePrevMonthClick}
          type="button"
        >
          Prev
        </button>
        <h2>
          {currentYear} - {currentMonth}
        </h2>
        <button
          className="bg-black text-white px-2 py-2 rounded"
          onClick={handleNextMonthClick}
          type="button"
        >
          Next
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(Array(Math.ceil(days.length / 7)).keys()).map((week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((day, index) => (
                <td
                  className={`cursor-pointer hover:bg-slate-700 hover:text-white ${
                    day + 1 === selectedDate.getDate() &&
                    currentMonth - 1 === selectedDate.getMonth() &&
                    currentYear === selectedDate.getFullYear()
                      ? "bg-black text-white"
                      : ""
                  }`}
                  key={index}
                  onClick={(e) => handleDayClick(day + 1)}
                >
                  {day !== null && day + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
