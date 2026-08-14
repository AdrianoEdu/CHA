// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import React, { Children, JSX } from "react";

type FooterProps = {
  children: React.ReactNode;
};

export function Footer({ children }: FooterProps): JSX.Element {
  return <div className="w-full mt-8 flex justify-end pr-5">{children}</div>;
}
