// Copyright (c) 2026-08-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React, { JSX } from "react";

type BodyPageProps = {
  children: React.ReactNode;
};

export function BodyPage({ children }: Readonly<BodyPageProps>): JSX.Element {
  return (
    <div className="p-5 gap-8 mt-10 bg-gray-200 rounded-2xl">{children}</div>
  );
}
