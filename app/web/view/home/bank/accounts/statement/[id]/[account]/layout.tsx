// Copyright (c) 2026-06-28
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.
import React, { ReactNode } from "react";

export default function CurrentAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex flex-col flex-1 ">{children}</div>;
}
