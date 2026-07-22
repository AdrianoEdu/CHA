// Copyright (c) 2026-20-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SearchComponentProps } from "./type";

const DEBOUNCE_TIME = 500;

export function SearchComponent({ onChange }: SearchComponentProps) {
  const [search, setSearch] = useState("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleOnChangeText = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const text = e.target.value;

    setSearch(text);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(text);
    }, DEBOUNCE_TIME);
  };

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-4
        mb-6
      "
    >
      <input
        value={search}
        onChange={handleOnChangeText}
        placeholder="Pesquisar movimentação..."
        className="
          w-full
          rounded-lg
          border
          border-slate-200
          px-4
          py-3
          outline-none
          focus:border-blue-500
        "
      />
    </div>
  );
}