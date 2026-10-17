// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import type { ReactNode } from "react";

interface CheckboxIconProps {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function CheckboxIcon({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: Readonly<CheckboxIconProps>) {
  return (
    <label
      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-800">
          {title}
        </span>

        <span className="mt-1 block text-sm leading-5 text-gray-500">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 cursor-pointer accent-sky-600"
      />
    </label>
  );
}
