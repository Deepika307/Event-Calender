// src/components/Calendar.jsx
import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="text-purple-600 hover:text-purple-900 text-2xl"
        >
          ‹
        </button>
        <h2 className="text-xl font-semibold text-purple-700">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-purple-600 hover:text-purple-900 text-2xl"
        >
          ›
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-2 text-purple-700 font-medium">
        {days.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day}
            className={`h-20 border rounded-lg p-1 text-sm text-center cursor-pointer 
              ${
                isToday
                  ? "bg-purple-300 text-white"
                  : isCurrentMonth
                  ? "bg-white"
                  : "bg-gray-100 text-gray-400"
              }`}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2 mt-2">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
