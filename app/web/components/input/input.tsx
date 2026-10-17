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

  onlyDay?: boolean;
  showCalendar?: boolean;
  onCalendarVisibilityChange?: (visible: boolean) => void;
}

export default function Input({
  regex,
  label,
  onlyDay,
  showCalendar,
  regexMessageError,
  inputType = InputType.Text,
  onChange,
  onValueChange,
  onRegexError,
  onCalendarVisibilityChange,
  ...rest
}: Readonly<InputProps>) {
  const [showErrorRegex, setShowErrorRegex] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [messageErrorRegex, setMessageErrorRegex] = useState(regexMessageError);

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
        setDisplayValue(String(rest.value ?? ""));
      }

      return;
    }

    if (inputType === InputType.Date) {
      if (onlyDay) {
        if (rest.value instanceof Date) {
          setDisplayValue(String(rest.value.getDate()));
        } else if (typeof rest.value === "number" && rest.value > 31) {
          setDisplayValue(String(new Date(rest.value).getDate()));
        } else {
          setDisplayValue(String(rest.value ?? ""));
        }

        return;
      }

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

  function handleCalendarVisibility(visible: boolean) {
    onCalendarVisibilityChange?.(visible);
  }

  function handleOnPress(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = e.target.value;

    if (inputType === InputType.Date) {
      handleCalendarVisibility(true);
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
    setDisplayValue(
      onlyDay ? String(date.getDate()) : date.toLocaleDateString("pt-BR"),
    );

    handleCalendarVisibility(false);

    onValueChange?.(onlyDay ? date.getDate() : date);
  }

  function handleCalendarClose() {
    handleCalendarVisibility(false);
  }

  const calendarValue = onlyDay
    ? typeof rest.value === "number"
      ? new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          Math.min(
            rest.value,
            new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0,
            ).getDate(),
          ),
        )
      : undefined
    : rest.value instanceof Date
      ? rest.value
      : typeof rest.value === "string" && rest.value
        ? new Date(rest.value)
        : undefined;

  return (
    <div className="w-full bg-transparent">
      <div className="relative w-full">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
          </span>
        )}

        {inputType === InputType.Annotation ? (
          <textarea
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={rest.name}
            placeholder={rest.placeholder ?? " "}
            disabled={rest.disabled}
            onChange={handleOnPress}
            value={displayValue}
            rows={4}
            className={`peer min-h-25 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
              rest.className ?? ""
            }`}
          />
        ) : (
          <input
            {...rest}
            id={rest.name}
            placeholder={rest.placeholder ?? " "}
            disabled={rest.disabled}
            onChange={handleOnPress}
            onClick={() => {
              if (inputType === InputType.Date) {
                handleCalendarVisibility(true);
              }
            }}
            type={resolveHtmlType(inputType)}
            value={displayValue}
            className={`peer h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
              rest.className ?? ""
            }`}
          />
        )}

        {inputType === InputType.Date && showCalendar && (
          <Calendar
            value={calendarValue}
            disabled={rest.disabled}
            open={showCalendar}
            onClose={handleCalendarClose}
            onChange={handleCalendarChange}
          />
        )}

        <label
          htmlFor={rest.name}
          className={`
          pointer-events-none absolute left-2.5
          bg-white px-1 text-sm text-gray-500
          transition-all duration-150
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-sm
          peer-focus:-top-2
          peer-focus:text-xs
          peer-focus:text-sky-600
          peer-not-placeholder-shown:-top-2
          peer-not-placeholder-shown:text-xs
        `}
        >
          {rest.name}
        </label>

        {showErrorRegex && (
          <span className="mt-1.5 block text-xs text-red-600">
            {messageErrorRegex}
          </span>
        )}
      </div>
    </div>
  );
}
