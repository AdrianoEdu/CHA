// Copyright (c) 2026-03-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { SelectHTMLAttributes } from "react";

export interface ComboboxProps<
  T,
> extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  selected?: T;
  options: T[];
  onSelectOption: (data: T) => void;

  valueKey: keyof T & string;
  labelKey: keyof T & string;
}

export default function ComboBox<T>({
  label = "Selecione...",
  options,
  selected,
  onSelectOption,
  valueKey,
  labelKey,
  ...rest
}: Readonly<ComboboxProps<T>>) {
  const handleSelectOptions = (value: string): void => {
    const item = options.find((o) => String(o[valueKey]) === value);

    if (item) onSelectOption(item);
  };

  return (
    <div className="relative w-72 p-4">
      <select
        {...rest}
        value={selected ? String(selected[valueKey]) : ""}
        onChange={(e) => handleSelectOptions(e.target.value)}
        className={`peer bg-white h-10 w-72 rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none appearance-none ${rest.className ?? ""}`}
      >
        <option value="">{label}</option>

        {options.map((item, index) => (
          <option key={index} value={String(item[valueKey])}>
            {String(item[labelKey])}
          </option>
        ))}
      </select>

      <p className="mt-2 text-sm text-gray-500">
        Selecionado: {selected ? String(selected[labelKey]) : "Nenhum"}
      </p>
    </div>
  );
}
