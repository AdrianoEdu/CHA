// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { InputHTMLAttributes, useEffect, useState } from "react";
import { formatCNPJ, formatMoney } from "../../utils/inputFormatter";

export enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
  Money = "money",
  Cnpj = "Cnpj",
  Date = "date",
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType?: InputType;
  regex?: RegExp;
  regexError?: boolean;
  regexMessageError?: string;
  onRegexError?: (status: boolean) => void;
}

export default function Input({
  inputType = InputType.Text,
  regex,
  regexError,
  regexMessageError,
  onRegexError,
  ...rest
}: Readonly<InputProps>) {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    const rawValue = String(rest.value ?? "");

    const formatter = formatters[inputType];

    if (formatter && inputType !== InputType.Date) {
      setDisplayValue(formatter(rawValue).formatted);
      return;
    }

    setDisplayValue(rawValue);
  }, [rest.value, inputType]);

  function resolveHtmlType(type: InputType) {
    if (type === InputType.Number) return "number";
    if (type === InputType.Password) return "password";
    if (type === InputType.Date) return "date"; // ✅ suporte a date
    return "text";
  }

  const formatters: Partial<
    Record<InputType, (value: string) => { raw: string; formatted: string }>
  > = {
    [InputType.Money]: formatMoney,
    [InputType.Cnpj]: formatCNPJ,
  };

  function handleOnPress(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    const formatter = formatters[inputType];

    if (formatter && inputType !== InputType.Date) {
      const { raw, formatted } = formatter(value);

      setDisplayValue(formatted);

      rest.onChange?.({
        ...e,
        target: {
          ...e.target,
          value: raw,
        },
      } as React.ChangeEvent<HTMLInputElement>);

      return;
    }

    setDisplayValue(value);

    if (onRegexError) {
      if (regex && !regex.test(value)) onRegexError(true);
      else onRegexError(false);
    }

    rest.onChange?.(e);
  }

  return (
    <div className="bg-transparent p-2 rounded-lg">
      <div className="relative w-72">
        <input
          id={rest.name}
          placeholder=" "
          disabled={rest.disabled}
          onChange={handleOnPress}
          type={resolveHtmlType(inputType)}
          value={
            [InputType.Money, InputType.Cnpj].includes(inputType)
              ? displayValue
              : (rest.value ?? "")
          }
          className={`peer bg-white h-10 w-full rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none ${rest.className}`}
        />

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

        {regexError && (
          <span className="text-red-500 text-xs mt-1 block">
            {regexMessageError}
          </span>
        )}
      </div>
    </div>
  );
}
