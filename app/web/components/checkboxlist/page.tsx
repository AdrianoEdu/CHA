// Copyright (c) 2026-04-08
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState } from "react";
import CheckBox from "../checkbox/page";

type CheckBoxListProps = {
  options: string[];
  onSelect: (value: string) => void;
  label?: string; // label opcional
};

export default function CheckboxList({
  options,
  onSelect,
  label,
}: CheckBoxListProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleChange = (value: string) => {
    if (selected === value) {
      setSelected(null);
      onSelect("");
    } else {
      setSelected(value);
      onSelect(value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-gray-500 text-sm">{label}</span>}{" "}
      {/* label opcional */}
      <div className="flex flex-row gap-2">
        {options.map((option) => (
          <CheckBox
            key={option}
            text={option}
            status={selected === option}
            disabled={false}
            onPress={() => handleChange(option)}
          />
        ))}
      </div>
    </div>
  );
}
