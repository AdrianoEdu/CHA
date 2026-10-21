// Copyright (c) 2026-10-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SVGProps } from "react";

export default function SettingsIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a8 8 0 0 0 0-6l1.5-1.1-1.5-2.6-1.8.7a8 8 0 0 0-3-1.7L14.3 2h-3l-.3 2.3a8 8 0 0 0-3 1.7l-1.8-.7-1.5 2.6L6.2 9a8 8 0 0 0 0 6l-1.5 1.1 1.5 2.6 1.8-.7a8 8 0 0 0 3 1.7l.3 2.3h3l.3-2.3a8 8 0 0 0 3-1.7l1.8.7 1.5-2.6L19.4 15Z" />
    </svg>
  );
}
