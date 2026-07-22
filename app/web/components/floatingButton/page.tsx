// Copyright (c) 2026-21-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { AddIcon } from "../../icons";
import { FloatingButtonProps } from "./type";

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      className="bottom-8 right-8 z-50 h-16 w-16 fixed rounded-full bg-blue-600 text-white flex items-center justify-center 
      text-7xl font-black font-bold leading-none shadow-2xl transition-all duration-300 hover:bg-blue-700 hover:scale-110 active:scale-95"
    >
      <AddIcon size={48} />
    </button>
  );
}