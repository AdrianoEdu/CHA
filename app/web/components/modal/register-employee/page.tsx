// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useState } from "react";
import Button from "../../button/page";
import Input from "../../input/page";
import { Regex } from "@/app/web/constants/regex";
import { i18n } from "@/app/web/constants/i18n";

const {
  cancelButton,
  errorEmptyName,
  errorInvalidName,
  inputNamePlaceholder,
  registerButton,
} = i18n["Pt-Br"].Modal.RegisterEmployee;

export type RegisterEmployeeProps = {
  onRegister: (value: string) => Promise<void>;
  onClose: () => void;
};

export default function RegisterEmployeeModal({
  onRegister,
  onClose,
}: Readonly<RegisterEmployeeProps>) {
  const [name, setName] = useState("");
  const [showErrorRegex, setShowErrorRegex] = useState(false);

  const errorRegexMessage =
    name.trim() === "" ? errorEmptyName : errorInvalidName;

  const handleRegisterEmployee = async (): Promise<void> => {
    if (name.trim() === "") {
      setShowErrorRegex(true);
      return;
    }

    onRegister(name);
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        regex={Regex.employeeName}
        regexError={showErrorRegex}
        name={inputNamePlaceholder}
        onRegexError={setShowErrorRegex}
        regexMessageError={errorRegexMessage}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          text={registerButton}
          disabled={showErrorRegex}
          onPress={handleRegisterEmployee}
        />
      </div>
    </div>
  );
}
