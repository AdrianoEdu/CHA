// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState } from "react";

export enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
}

type InputProps = {
  label: string;
  inputType?: InputType;
  onChange: (text: string) => void;
};

export default function Input({
  label,
  inputType = InputType.Text,
  onChange,
}: Readonly<InputProps>) {
  const [text, setText] = useState("");

  const onChangeText = (value: string): void => {
    setText(value);
    onChange(value);
  };

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <div className="relative w-72">
        <input
          type={inputType}
          id={label}
          name={label}
          value={text}
          className="peer bg-white h-10 w-full rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none"
          placeholder=" "
          onChange={(e) => onChangeText(e.target.value)}
        />

        <label
          htmlFor={label}
          className="
            absolute left-2 
            bg-white px-1
            text-gray-500 text-sm
            transition-all

            /* estado normal */
            top-2

            /* quando tem texto ou foco */
            peer-focus:-top-3
            peer-focus:text-sky-600
            peer-focus:text-xs

            peer-[&:not(:placeholder-shown)]:-top-3
            peer-[&:not(:placeholder-shown)]:text-xs

            pointer-events-none
          "
        >
          {label}
        </label>
      </div>
    </div>
  );
}
