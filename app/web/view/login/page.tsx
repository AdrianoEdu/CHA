// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Image from "next/image";
import Input, { InputType } from "../../components/input/page";

export default function Login() {
  return (
    <div className="flex-row min-h-screen flex items-center justify-center bg-off-white">
      <div className="flex bg-transparent w-[800px] border-2 border-black rounded-2xl overflow-hidden justify-around">
        <div className="flex items-center justify-center p-6">
          <Image
            src={"/images/logo.jpeg"}
            alt="Logo"
            width={200}
            height={200}
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col justify-center gap-4 p-8 bg-transparent">
          <Input
            label="Informe seu usuário"
            inputType={InputType.Password}
            onChange={(text) => console.log(text)}
          />

          <Input
            label="Informe sua senha"
            inputType={InputType.Password}
            onChange={(text) => console.log(text)}
          />
        </div>
      </div>
    </div>
  );
}
