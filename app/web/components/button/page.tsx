// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
};

export default function Button({
  text,
  icon,
  onPress,
  ...rest
}: Readonly<ButtonProps>) {
  return (
    <button
      onClick={onPress}
      {...rest}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4 py-2
        bg-blue-600
        text-white
        rounded-lg
        font-medium
        whitespace-normal
        text-center
        ${rest.className ?? ""}
      `}
    >
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
}
