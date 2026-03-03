// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState } from "react";
import Button from "../../button/page";
import Input from "../../input/page";

export type RegisterUserProps = {
  onRegister: (value: string) => Promise<void>;
  onClose: () => void;
};

export default function RegisterUser({
  onRegister,
  onClose,
}: Readonly<RegisterUserProps>) {
  const [name, setName] = useState("");

  const handleRegisterUser = async (): Promise<void> => onRegister(name);

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        onChange={(e) => setName(e.target.value)}
        name={"Informe o nome do seu funcionário"}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button text="Cancelar" onPress={onClose} />
        <Button text="Registrar" onPress={handleRegisterUser} />
      </div>
    </div>
  );
}
