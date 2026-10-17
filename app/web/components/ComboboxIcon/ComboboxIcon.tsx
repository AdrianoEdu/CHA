// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon } from "../../icons";

export interface ComboBoxIconOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface ComboBoxIconProps {
  name: string;
  description?: string;
  icon: ReactNode;
  options: ComboBoxIconOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function ComboBoxIcon({
  name,
  description,
  icon,
  options,
  value,
  placeholder = "Selecione uma opção",
  onChange,
}: ComboBoxIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>

          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm transition hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDownIcon
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-gray-50"
            >
              {option.icon && (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  {option.icon}
                </div>
              )}

              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium">{option.label}</span>

                {option.description && (
                  <span className="text-xs text-gray-500">
                    {option.description}
                  </span>
                )}
              </div>

              {value === option.value && (
                <CheckIcon className="text-green-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
