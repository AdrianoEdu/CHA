// Copyright (c) 2026-07-20
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ListProps } from "./type";

export function List({ title, children }: ListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2>{title}</h2>
      </div>

      {children}
    </div>
  );
}