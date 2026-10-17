// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export default function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      {...props}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
