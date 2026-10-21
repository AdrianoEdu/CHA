// Copyright (c) 2026-10-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SVGProps } from "react";

export default function BackupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v12c0 1.66 3.58 3 8 3" />
      <path d="M20 5v5" />
      <path d="M20 14v6" />
      <path d="m17 17 3 3 3-3" />
    </svg>
  );
}
