// Copyright (c) 2026-08-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React, { JSX } from "react";

type HeaderProps = {
  title: string;
  description?: string;
};

export function Header({ title }: Readonly<HeaderProps>): JSX.Element {
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold text-gray-700">{title}</h1>
    </div>
  );
}
