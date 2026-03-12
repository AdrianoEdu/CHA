// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { InputHTMLAttributes, useState } from "react";

export enum InputType {
  Text = "text",
  Password = "password",
  Number = "number",
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  regex?: RegExp;
  regexError?: boolean;
  regexMessageError?: string;
  onRegexError?: (status: boolean) => void;
}

export default function Input({
  regex,
  regexError,
  regexMessageError,
  onRegexError,
  ...rest
}: Readonly<InputProps>) {
  function handleOnPress(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (onRegexError) {
      if (regex && !regex.test(value)) onRegexError(true);
      else onRegexError(false);
    }

    rest.onChange?.(e);
  }

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <div className="relative w-72">
        <input
          id={rest.name}
          name={rest.name}
          type={rest.type}
          placeholder={" "}
          value={rest.value}
          disabled={rest.disabled}
          onChange={handleOnPress}
          className={`peer bg-white h-10 w-full rounded-lg text-black px-2 ring-2 ring-gray-500 focus:ring-sky-600 focus:outline-none ${rest.className}`}
        />

        <label
          htmlFor={rest.name}
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

            peer-not-placeholder-shown:-top-3
            peer-not-placeholder-shown:text-xs

            pointer-events-none
          "
        >
          {rest.name}
        </label>
        {regexError && (
          <span className="text-red-500 text-xs mt-1 block">
            {regexMessageError}
          </span>
        )}
      </div>
    </div>
  );
}
