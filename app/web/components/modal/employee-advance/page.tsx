// Copyright (c) 2026-03-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import Button from "../../button/page";
import Input, { InputType } from "../../input/page";
import { Regex } from "@/app/web/constants/regex";
import { i18n } from "@/app/web/constants/i18n";
import ComboBox from "../../combobox/page";
import { advanceReasonService } from "@/app/web/services/advanceReasonService/advanceReasonService";
import { FindAdvanceReasonDto } from "@/app/web/dto/advance-reason.dto";

const { cancelButton, registerButton, RegisterEmployeeAdvanced } =
  i18n["Pt-Br"].Modal;

const { inputNamePlaceholder, inputAmountPlaceholder } =
  RegisterEmployeeAdvanced;

export type RegisterEmployeeAdvanceProps = {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
  onRegister: (optionId: string, amount: number) => Promise<void>;
};

export default function RegisterEmployeeAdvanceModal({
  employeeName,
  onClose,
  onRegister,
}: Readonly<RegisterEmployeeAdvanceProps>) {
  const [name, setName] = useState("");
  const [amout, setAmout] = useState(0);
  const [advanceReasonList, setAdvanceReasonList] = useState<
    FindAdvanceReasonDto[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<FindAdvanceReasonDto>({
    id: "",
    name: "",
  });

  useEffect(() => {
    setName(employeeName);
    handleGetAllAdvanceReason();
  }, []);

  const handleGetAllAdvanceReason = async (): Promise<void> => {
    const result = await advanceReasonService.findAll();
    setAdvanceReasonList(result);
  };

  const handleRegisterAdvanceEmployee = (): void => {
    onRegister(selectedOption.id, amout);
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        disabled
        value={name}
        className="flex-1"
        name={inputNamePlaceholder}
      />

      <ComboBox
        valueKey={"id"}
        labelKey={"name"}
        selected={selectedOption}
        options={advanceReasonList}
        onSelectOption={setSelectedOption}
      />

      <Input
        value={amout}
        regex={Regex.onlyText}
        inputType={InputType.Money}
        name={inputAmountPlaceholder}
        className={"flex-1 appearance-none no-spinner"}
        onChange={(e) => setAmout(Number(e.target.value))}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          text={registerButton}
          disabled={selectedOption.id !== "" && !!!amout}
          onPress={handleRegisterAdvanceEmployee}
        />
      </div>
    </div>
  );
}
