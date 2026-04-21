// Copyright (c) 2026-03-16
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
    const item = options.find((o) => String(o[valueKey]) === value);

    onSelectOption(item ?? null);
  };

  return (
    <div className="relative w-72 px-2">
      {label && <p className="text-sm text-gray-500 mb-2">{label}</p>}

      <select
        {...rest}
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`peer bg-white h-10 w-72 rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none appearance-none ${className ?? ""}`}
      >
        {/* placeholder controlado */}
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
    </div>
  );
}
