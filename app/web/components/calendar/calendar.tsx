// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useRef, useState } from "react";

interface CalendarProps {
  value?: Date | string;
  onChange?: (value: Date) => void;
  disabled?: boolean;
  open?: boolean;
  onClose?: () => void;
}

function parseDate(value?: Date | string): Date {
  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value === "string" && value) {
    const [year, month, day] = value.split("-").map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  return new Date();
}

export default function Calendar({
  value,
  onChange,
  disabled = false,
  open = false,
  onClose,
}: Readonly<CalendarProps>) {
  const [currentDate, setCurrentDate] = useState(() => parseDate(value));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setCurrentDate(parseDate(value));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!open) {
    return null;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectDay = (day: number) => {
    const selectedDate = new Date(year, month, day);

    onChange?.(selectedDate);
    onClose?.();
  };

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-full z-50 mt-2 w-full min-w-72 rounded-lg bg-white p-4 shadow-xl ring-1 ring-gray-200"
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          disabled={disabled}
          onClick={previousMonth}
          className="rounded-md px-3 py-1 text-gray-700 hover:bg-gray-100"
        >
          ‹
        </button>

        <span className="font-semibold capitalize text-gray-800">
          {monthName}
        </span>

        <button
          type="button"
          disabled={disabled}
          onClick={nextMonth}
          className="rounded-md px-3 py-1 text-gray-700 hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const selectedDate = parseDate(value);

          const isSelected =
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day;

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => selectDay(day)}
              className={`h-9 rounded-md text-sm transition ${
                isSelected
                  ? "bg-sky-600 text-white"
                  : "text-gray-700 hover:bg-sky-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
