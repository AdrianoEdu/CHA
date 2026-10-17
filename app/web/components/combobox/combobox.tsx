// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { SelectHTMLAttributes } from "react";

type KeyOf<T> = keyof T & string;

export interface ComboboxProps<T> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> {
  selected: T | null;
  options: T[];
  label?: string;
  placeholder?: string;
  onSelectOption: (data: T | null) => void;
  valueKey: KeyOf<T>;
  labelKey: KeyOf<T>;
}

export default function ComboBox<T>({
  label,
  options,
  selected,
  valueKey,
  labelKey,
  placeholder = "Selecione...",
  onSelectOption,
  className,
  ...rest
}: Readonly<ComboboxProps<T>>) {
  const selectedValue = selected ? String(selected[valueKey]) : "";

  const handleChange = (value: string) => {
    const item = options.find((option) => String(option[valueKey]) === value);

    onSelectOption(item ?? null);
  };

  return (
    <div className="w-full bg-transparent">
      {label && (
        <label
          className="mb-1.5 block text-sm font-medium text-gray-700"
          htmlFor={rest.id ?? rest.name}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <select
          {...rest}
          id={rest.id ?? rest.name}
          value={selectedValue}
          onChange={(event) => handleChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-900 shadow-sm outline-none transition-colors hover:border-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
            className ?? ""
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((item) => {
            const value = String(item[valueKey]);

            return (
              <option key={value} value={value}>
                {String(item[labelKey])}
              </option>
            );
          })}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
