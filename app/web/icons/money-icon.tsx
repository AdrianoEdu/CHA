// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export default function MoneyIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={22}
      height={22}
      {...props}
    >
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <circle cx="12" cy="12.5" r="3" />
      <path d="M6 10h.01M18 15h.01" />
    </svg>
  );
}
