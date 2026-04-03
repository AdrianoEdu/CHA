// Copyright (c) 2026-04-02
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { InputHTMLAttributes, JSX } from "react";

type CheckBoxProps = {
  text?: string;
  status: boolean;
  disabled?: boolean;
  onPress: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CheckBox({
  status,
  disabled,
  text = "",
  onPress,
}: CheckBoxProps): JSX.Element {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        disabled={disabled}
        checked={status}
        className="w-4 h-4"
        onChange={onPress}
      />
      {text}
    </label>
  );
}
