// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

interface ToggleProps {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;

  titleSize?: string;
  toggleSize?: string;
  thumbSize?: string;
}

export function Toggle({
  title,
  value,
  onChange,
  titleSize = "text-2xl",
  toggleSize = "h-6 w-11",
  thumbSize = "h-5 w-5",
}: ToggleProps) {
  return (
    <div className="flex flex-row items-center justify-between p-2">
      <span className={`font-medium text-gray-700 ${titleSize}`}>{title}</span>

      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors ${
          value ? "bg-blue-600" : "bg-gray-300"
        } ${toggleSize}`}
      >
        <span
          className={`pointer-events-none block translate-y-0.5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          } ${thumbSize}`}
        />
      </button>
    </div>
  );
}
