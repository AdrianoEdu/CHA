// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { InputHTMLAttributes, useState } from "react";

export enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
  Money = "money",
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
  const [displayValue, setDisplayValue] = useState<string>(
    String(rest.value ?? ""),
  );

  function resolveHtmlType(type: InputType) {
    if (type === InputType.Number) return "number";
    if (type === InputType.Password) return "password";
    return "text";
  }

  function formatMoney(value: string) {
    const numbers = value.replace(/\D/g, "");
    const number = Number(numbers) / 100;

    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function handleOnPress(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    if (inputType === InputType.Money) {
      const raw = value.replace(/\D/g, "");
      const formatted = formatMoney(raw);

      setDisplayValue(formatted);

      const numericValue = Number(raw) / 100;

      rest.onChange?.({
        ...e,
        target: {
          ...e.target,
          value: numericValue.toString(),
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
    <div className="bg-transparent p-4 rounded-lg">
      <div className="relative w-72">
        <input
          id={rest.name}
          name={rest.name}
          placeholder={" "}
          disabled={rest.disabled}
          onChange={handleOnPress}
          type={resolveHtmlType(inputType)}
          value={inputType === InputType.Money ? displayValue : rest.value}
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
