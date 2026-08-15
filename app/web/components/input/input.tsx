// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { InputHTMLAttributes, useEffect, useState } from "react";
import { formatCNPJ, formatCPF, formatMoney } from "../../utils/inputFormatter";
import Calendar from "../calendar/calendar";

export enum InputType {
  CPF = "Cpf",
  Text = "text",
  Date = "date",
  Cnpj = "Cnpj",
  Money = "money",
  Number = "number",
  Password = "password",
  Annotation = "annotation",
}

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  value?: string | number | Date | readonly string[];
};

interface InputProps extends BaseInputProps {
  inputType?: InputType;
  label?: string;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  onValueChange?: (value: number | string | Date) => void;

  regex?: RegExp;
  regexMessageError?: string;
  onRegexError?: (status: boolean) => void;
}

export default function Input({
  regex,
  regexMessageError,
  inputType = InputType.Text,
  label,
  onChange,
  onValueChange,
  onRegexError,
  ...rest
}: Readonly<InputProps>) {
  const [showErrorRegex, setShowErrorRegex] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [messageErrorRegex, setMessageErrorRegex] = useState(regexMessageError);
  const [showCalendar, setShowCalendar] = useState(false);

  const formatters: Partial<
    Record<InputType, (value: string) => { raw: string; formatted: string }>
  > = {
    [InputType.Money]: formatMoney,
    [InputType.Cnpj]: formatCNPJ,
    [InputType.CPF]: formatCPF,
  };

  useEffect(() => {
    if (inputType === InputType.Money) {
      if (typeof rest.value === "number") {
        const cents = Math.round(rest.value * 100).toString();

        setDisplayValue(formatMoney(cents).formatted);
      } else {
        setDisplayValue("");
      }

      return;
    }

    if (inputType === InputType.Date) {
      if (rest.value instanceof Date) {
        setDisplayValue(rest.value.toLocaleDateString("pt-BR"));
      } else if (typeof rest.value === "string" && rest.value) {
        const date = new Date(rest.value);

        setDisplayValue(
          isNaN(date.getTime()) ? rest.value : date.toLocaleDateString("pt-BR"),
        );
      } else {
        setDisplayValue("");
      }

      return;
    }

    const rawValue = String(rest.value ?? "");
    const formatter = formatters[inputType];

    if (formatter) {
      setDisplayValue(formatter(rawValue).formatted);
      return;
    }

    setDisplayValue(rawValue);
  }, [rest.value, inputType]);

  function resolveHtmlType(type: InputType) {
    if (type === InputType.Number) return "number";
    if (type === InputType.Password) return "password";

    return "text";
  }

  function handleOnPress(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = e.target.value;

    if (inputType === InputType.Date) {
      setShowCalendar(true);
      return;
    }

    if (inputType === InputType.Money) {
      const onlyNumbers = value.replace(/\D/g, "");
      const numeric = Number(onlyNumbers) / 100;
      const safeValue = isNaN(numeric) ? 0 : numeric;

      const formatted = formatMoney(onlyNumbers).formatted;

      setDisplayValue(formatted);

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onValueChange?.(safeValue);
      onChange?.(newEvent);

      return;
    }

    const formatter = formatters[inputType];

    if (formatter) {
      const { raw, formatted } = formatter(value);

      setDisplayValue(formatted);

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onValueChange?.(raw);
      onChange?.(newEvent);

      return;
    }

    setDisplayValue(value);

    if (regex) {
      const currentMessageErrorRegex =
        value.trim() === "" ? "" : messageErrorRegex;

      setMessageErrorRegex(currentMessageErrorRegex);

      // Evita problema com RegExp usando /g ou /y
      regex.lastIndex = 0;
      const isValid = regex.test(value);
      regex.lastIndex = 0;

      const showError = value.trim() !== "" && !isValid;

      setShowErrorRegex(showError);
      onRegexError?.(showError);
    } else {
      setShowErrorRegex(false);
      onRegexError?.(false);
    }

    onValueChange?.(value);
    onChange?.(e);
  }

  function handleCalendarChange(date: Date) {
    setDisplayValue(date.toLocaleDateString("pt-BR"));
    setShowCalendar(false);

    onValueChange?.(date);
  }

  const calendarValue =
    rest.value instanceof Date
      ? rest.value
      : typeof rest.value === "string" && rest.value
        ? new Date(rest.value)
        : undefined;

  return (
    <div className="bg-transparent p-2 rounded-lg">
      <div className="relative w-full">
        {label && (
          <span className="block mb-1 text-2xl font-medium text-gray-700">
            {label}
          </span>
        )}

        {inputType === InputType.Annotation ? (
          <textarea
            id={rest.name}
            placeholder=" "
            disabled={rest.disabled}
            onChange={handleOnPress}
            value={displayValue}
            rows={4}
            className={`peer bg-white w-full min-h-25 rounded-lg text-black px-2 py-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none resize-none ${rest.className ?? ""}`}
          />
        ) : (
          <input
            id={rest.name}
            placeholder=" "
            disabled={rest.disabled}
            onChange={handleOnPress}
            onClick={() => {
              if (inputType === InputType.Date) {
                setShowCalendar(true);
              }
            }}
            type="text"
            value={
              inputType === InputType.Money ||
              inputType === InputType.Cnpj ||
              inputType === InputType.CPF ||
              inputType === InputType.Date
                ? displayValue
                : typeof rest.value === "string" ||
                    typeof rest.value === "number" ||
                    Array.isArray(rest.value)
                  ? rest.value
                  : ""
            }
            className={`peer bg-white h-10 w-full rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none ${rest.className ?? ""}`}
          />
        )}

        {inputType === InputType.Date && showCalendar && (
          <Calendar
            value={calendarValue}
            disabled={rest.disabled}
            open={showCalendar}
            onClose={() => setShowCalendar(false)}
            onChange={handleCalendarChange}
          />
        )}

        <label
          htmlFor={rest.name}
          className="
            absolute left-2
            bg-white px-1
            text-gray-500 text-sm
            transition-all
            top-2
            peer-focus:-top-3
            peer-focus:text-sky-600
            peer-focus:text-xs
            peer-not-placeholder-shown:-top-3
            peer-not-placeholder-shown:text-xs
            pointer-events-none
          "
        >
          {rest.name}
        </label>

        {showErrorRegex && (
          <span className="text-red-500 text-xs mt-1 block">
            {messageErrorRegex}
          </span>
        )}
      </div>
    </div>
  );
}
