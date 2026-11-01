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

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function parseDate(value?: Date | string): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string" && value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      const date = new Date(year, month - 1, day);

      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        return date;
      }
    }

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  }

  return new Date();
}

function sameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
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

  const selectedDate = value ? parseDate(value) : null;
  const today = new Date();

  useEffect(() => {
    if (value) {
      setCurrentDate(parseDate(value));
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = Array.from(
    { length: firstDayOfMonth + daysInMonth },
    (_, index) => {
      if (index < firstDayOfMonth) return null;
      return index - firstDayOfMonth + 1;
    },
  );

  function changeMonth(offset: number) {
    setCurrentDate(new Date(year, month + offset, 1));
  }

  function changeYear(nextYear: number) {
    setCurrentDate(new Date(nextYear, month, 1));
  }

  function changeMonthSelection(nextMonth: number) {
    setCurrentDate(new Date(year, nextMonth, 1));
  }

  function selectDay(day: number) {
    onChange?.(new Date(year, month, day));
    onClose?.();
  }

  function goToToday() {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  const yearOptions = Array.from(
    { length: 201 },
    (_, index) => today.getFullYear() - 100 + index,
  );

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Selecionar data"
      className="absolute left-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeMonth(-1)}
          aria-label="Mês anterior"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_88px] gap-2">
          <select
            aria-label="Mês"
            value={month}
            disabled={disabled}
            onChange={(event) =>
              changeMonthSelection(Number(event.target.value))
            }
            className="h-9 min-w-0 rounded-lg border border-gray-200 bg-white px-2 text-sm font-semibold text-gray-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
          >
            {MONTHS.map((monthName, index) => (
              <option key={monthName} value={index}>
                {monthName}
              </option>
            ))}
          </select>

          <select
            aria-label="Ano"
            value={year}
            disabled={disabled}
            onChange={(event) => changeYear(Number(event.target.value))}
            className="h-9 min-w-0 rounded-lg border border-gray-200 bg-white px-2 text-sm font-semibold text-gray-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50"
          >
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => changeMonth(1)}
          aria-label="Próximo mês"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="flex h-8 items-center justify-center text-xs font-semibold text-gray-500"
          >
            {weekday}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-9" />;
          }

          const date = new Date(year, month, day);
          const isSelected = selectedDate ? sameDay(date, selectedDate) : false;
          const isToday = sameDay(date, today);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => selectDay(day)}
              aria-label={`${day} de ${MONTHS[month]} de ${year}`}
              aria-pressed={isSelected}
              className={`relative flex h-9 items-center justify-center rounded-lg text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? "bg-sky-600 font-semibold text-white shadow-sm hover:bg-sky-700"
                  : isToday
                    ? "border border-sky-500 font-semibold text-sky-700 hover:bg-sky-50"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-sky-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <button
          type="button"
          disabled={disabled}
          onClick={goToToday}
          className="rounded-lg px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:opacity-40"
        >
          Hoje
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
