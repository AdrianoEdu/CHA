// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import React from "react";

export enum ButtonStatusEnum {
  CONFIRM,
  UPDATE,
  CANCEL,
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: React.ReactNode;
  status?: ButtonStatusEnum;
  onPress?: () => void;
};

export default function Button({
  text,
  icon,
  status = ButtonStatusEnum.CONFIRM,
  onPress,
  ...rest
}: Readonly<ButtonProps>) {
  const getColorButton = (): string => {
    if (rest.disabled) return "bg-gray-400 text-gray-200";

    switch (status) {
      case ButtonStatusEnum.CANCEL:
        return "bg-red-500 text-white";
      case ButtonStatusEnum.UPDATE:
        return "bg-green-500 text-white";
      default:
        return "bg-blue-default text-white";
    }
  };

  return (
    <button
      onClick={onPress}
      disabled={rest.disabled}
      {...rest}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4 py-2
        rounded-lg
        font-medium
        whitespace-normal
        text-center
        transition

        ${getColorButton()}
        ${rest.className ?? ""}
      `}
    >
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
}
