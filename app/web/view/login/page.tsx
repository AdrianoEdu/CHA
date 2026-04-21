// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import Image from "next/image";
import Input, { InputType } from "../../components/input/page";
import Button from "../../components/button/page";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { auth } = useAuth();

  const onHandlerAuth = async (): Promise<void> => {
    await auth(login, password).then(() => clearFields());
  };

  const clearFields = (): void => {
    setLogin("");
    setPassword("");
  };

  return (
    <div className="flex-row min-h-screen flex items-center justify-center bg-blue-default">
      <div className="flex bg-off-white w-200 border-2 border-black rounded-2xl overflow-hidden justify-around">
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
            name="Informe seu usuário"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <Input
            value={password}
            name="Informe sua senha"
            inputType={InputType.Password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="self-end pr-4">
            <Button onPress={onHandlerAuth} text={"Entrar"} />
          </div>
        </div>
      </div>
    </div>
  );
}
