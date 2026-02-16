// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

enum ButtonType {
  Default,
  Success,
  Back,
}

type ButtonProps = {
  text: string;
  type?: ButtonType;
  onPress: () => Promise<void>;
};

export default function Button({
  text,
  type = ButtonType.Default,
  onPress,
}: Readonly<ButtonProps>) {
  return (
    <button
      onClick={onPress}
      className="
        inline-flex
        items-center
        justify-center

        px-4 py-2
        bg-blue-600
        text-white

        rounded-lg
        font-medium

        whitespace-normal
        text-center

        wrap-break-word
      "
    >
      <span>{text}</span>
    </button>
  );
}
