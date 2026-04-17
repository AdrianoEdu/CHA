// Copyright (c) 2026-04-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React, { ReactNode } from "react";

export default function CheckUsageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex flex-col flex-1 bg-amber-300">{children}</div>;
}
