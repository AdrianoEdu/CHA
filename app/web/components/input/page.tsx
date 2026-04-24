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
  Annotation = "annotation", // ✅ NOVO
}

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

interface InputProps extends BaseInputProps {
  inputType?: InputType;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onValueChange?: (value: number | string) => void;

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
  onChange,
  onValueChange,
  ...rest
}: Readonly<InputProps>) {
  const [displayValue, setDisplayValue] = useState<string>("");

  const formatters: Partial<
    Record<InputType, (value: string) => { raw: string; formatted: string }>
  > = {
    [InputType.Money]: formatMoney,
    [InputType.Cnpj]: formatCNPJ,
  };

  useEffect(() => {
    if (inputType === InputType.Money) {
      if (typeof rest.value === "number") {
        const cents = Math.round(rest.value * 100).toString();
        setDisplayValue(formatMoney(cents).formatted);
      }
      return;
    }

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
    if (type === InputType.Date) return "date";
    return "text";
  }

  function handleOnPress(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const value = e.target.value;

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

    if (formatter && inputType !== InputType.Date) {
      const { raw, formatted } = formatter(value);

      setDisplayValue(formatted);

      onValueChange?.(raw);
      onChange?.(e);

      return;
    }

    setDisplayValue(value);

    if (onRegexError) {
      if (regex && !regex.test(value)) onRegexError(true);
      else onRegexError(false);
    }

    onValueChange?.(value);
    onChange?.(e);
  }

  return (
    <div className="bg-transparent p-2 rounded-lg">
      <div className="relative w-72">
        {/* ✅ AQUI MUDA TUDO */}
        {inputType === InputType.Annotation ? (
          <textarea
            id={rest.name}
            placeholder=" "
            disabled={rest.disabled}
            onChange={handleOnPress}
            value={displayValue}
            rows={4}
            className={`peer bg-white w-full min-h-[100px] rounded-lg text-black px-2 py-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none resize-none ${rest.className}`}
          />
        ) : (
          <input
            id={rest.name}
            placeholder=" "
            disabled={rest.disabled}
            onChange={handleOnPress}
            type={resolveHtmlType(inputType)}
            value={
              inputType === InputType.Money || inputType === InputType.Cnpj
                ? displayValue
                : (rest.value ?? "")
            }
            className={`peer bg-white h-10 w-full rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none ${rest.className}`}
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

        {regexError && (
          <span className="text-red-500 text-xs mt-1 block">
            {regexMessageError}
          </span>
        )}
      </div>
    </div>
  );
}
