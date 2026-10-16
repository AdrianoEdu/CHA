// Copyright (c) 2026-10-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { ReactNode } from "react";

type SideBarActionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function SideBarAction({
  title,
  isOpen,
  onToggle,
  children,
}: SideBarActionProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
      >
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && <div className="flex flex-col">{children}</div>}
    </div>
  );
}
