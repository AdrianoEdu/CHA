// Copyright (c) 2026-03-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import Button from "../../button/page";
import Input, { InputType } from "../../input/page";
import { i18n } from "@/app/web/constants/i18n";
import ComboBox from "../../combobox/page";
import { advanceReasonService } from "@/app/web/services/advanceReasonService/advanceReasonService";
import {
  FindAdvanceReasonDto,
  SelectOptionAEmployeeAdvance,
} from "@/app/web/dto/advance-reason.dto";
import { CreateEmployeeAdvanceDto } from "@/app/web/dto/employee-advance.dto";

const { cancelButton, registerButton, RegisterEmployeeAdvanced } =
  i18n["Pt-Br"].Modal;

const { inputNamePlaceholder, inputAmountPlaceholder } =
  RegisterEmployeeAdvanced;

export function parseMoney(value: string | number): number {
  if (typeof value === "number") {
    return Number(value.toFixed(2));
  }

  if (!value) return 0;

  let cleaned = value.replace(/\s/g, "").replace("R$", "").trim();

  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const numberValue = Number(cleaned);

  // fallback seguro
  if (isNaN(numberValue)) return 0;

  return Number(numberValue.toFixed(2));
}

export type RegisterEmployeeAdvanceProps = {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
  onRegister: (data: CreateEmployeeAdvanceDto) => Promise<void>;
};

export default function RegisterEmployeeAdvanceModal({
  employeeId,
  employeeName,
  onClose,
  onRegister,
}: Readonly<RegisterEmployeeAdvanceProps>) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [advanceReasonList, setAdvanceReasonList] = useState<
    FindAdvanceReasonDto[]
  >([]);

  const [selectedOption, setSelectedOption] =
    useState<SelectOptionAEmployeeAdvance | null>(null);

  useEffect(() => {
    setName(employeeName);
    handleGetAllAdvanceReason();
  }, [employeeName]);

  const handleGetAllAdvanceReason = async (): Promise<void> => {
    const result = await advanceReasonService.findAll({
      skip: 0,
      take: 20,
      all: true,
      orderBy: { createdAt: "desc" },
    });

    setAdvanceReasonList(result);
  };

  const handleRegisterAdvanceEmployee = async (): Promise<void> => {
    if (!selectedOption) return;

    await onRegister({
      employeeId,
      amount: parseMoney(amount),
      reasonId: selectedOption.id,
    });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Input
        disabled
        value={name}
        className="flex-1"
        name={inputNamePlaceholder}
      />

      <ComboBox
        valueKey="id"
        labelKey="name"
        selected={selectedOption}
        options={advanceReasonList}
        onSelectOption={setSelectedOption}
      />

      <Input
        value={amount}
        inputType={InputType.Money}
        name={inputAmountPlaceholder}
        className="flex-1 appearance-none no-spinner"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />

        <Button
          text={registerButton}
          onPress={handleRegisterAdvanceEmployee}
          disabled={!selectedOption || parseMoney(amount) <= 0}
        />
      </div>
    </div>
  );
}
