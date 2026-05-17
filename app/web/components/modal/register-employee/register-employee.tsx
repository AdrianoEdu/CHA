// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState } from "react";
import Button from "../../button/button";
import Input from "../../input/input";
import { Regex } from "@/app/web/constants/regex";
import { i18n } from "@/app/web/constants/i18n";

const { cancelButton, RegisterEmployee, registerButton } = i18n["Pt-Br"].Modal;

const { errorEmptyName, errorInvalidName, inputNamePlaceholder } =
  RegisterEmployee;

export type RegisterEmployeeProps = {
  onRegister: (value: string) => Promise<void>;
  onClose: () => void;
};

export default function RegisterEmployeeModal({
  onRegister,
  onClose,
}: Readonly<RegisterEmployeeProps>) {
  const [name, setName] = useState("");
  const [disable, setDisable] = useState(false);

  const handleRegisterEmployee = async (): Promise<void> => onRegister(name);

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        name={inputNamePlaceholder}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          text={registerButton}
          onPress={handleRegisterEmployee}
          disabled={name === "" || disable}
        />
      </div>
    </div>
  );
}
