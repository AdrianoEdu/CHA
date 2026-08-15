// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import Button, { ButtonStatusEnum } from "../../button/button";
import Input, { InputType } from "../../input/input";
import { Regex } from "@/app/web/constants/regex";
import { i18n } from "@/app/web/constants/i18n";
import { CreateEmployeeDto, EmployeeDto } from "@/app/web/dto/employee.dto";
import { validateEmployeeForm } from "@/app/web/utils/employee/employee";

const { cancelButton, RegisterEmployee, registerButton, updateButton } =
  i18n["Pt-Br"].Modal;

const { inputNamePlaceholder } = RegisterEmployee;

export type UpsertEmployeeProps = {
  data?: EmployeeDto;
  onClose: () => void;
  onUpdate?: (data: EmployeeDto) => Promise<void>;
  onRegister?: (data: CreateEmployeeDto) => Promise<void>;
};

const MAX_LENGTH_CPF = 14;

export default function UspertEmployeeModal({
  data,
  onClose,
  onUpdate,
  onRegister,
}: Readonly<UpsertEmployeeProps>) {
  const [disable, setDisable] = useState(false);

  const [employee, setEmployee] = useState<EmployeeDto>({
    ...(data ?? {}),
    dateOfBirth: data?.dateOfBirth ?? new Date(),
    document: data?.document ?? "",
    name: data?.name ?? "",
  });

  const isRegister = !data;

  const formStatus = validateEmployeeForm({
    employee,
    maxLength: MAX_LENGTH_CPF,
  });

  useEffect(() => {
    if (!data) return;

    setEmployee(data);
  }, [data]);

  const handleIsRegexError = (status: boolean) => {
    setDisable(status);
  };

  const handleUpsertEmployee = async (): Promise<void> => {
    if (isRegister) {
      if (onRegister) {
        await onRegister({
          name: employee.name,
          document: employee.document,
          dateOfBirth: employee.dateOfBirth,
        });
      }

      return;
    }

    if (data?.id && onUpdate) {
      await onUpdate({
        ...data,
        name: employee.name,
        document: employee.document,
        dateOfBirth: employee.dateOfBirth,
      });
    }
  };

  const handleSetEmployee = (data: Partial<EmployeeDto>) => {
    setEmployee((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Input
        className="flex-1"
        value={employee.name}
        name={inputNamePlaceholder}
        onChange={(e) =>
          handleSetEmployee({
            name: e.target.value,
          })
        }
      />

      <Input
        className="flex-1"
        inputType={InputType.Date}
        name="Insira data de nascimento"
        value={employee.dateOfBirth}
        onValueChange={(currentDate) => {
          if (currentDate instanceof Date) {
            handleSetEmployee({
              dateOfBirth: currentDate,
            });
          }
        }}
      />

      <Input
        className="flex-1"
        regex={Regex.onlyCPF}
        value={employee.document}
        inputType={InputType.CPF}
        maxLength={MAX_LENGTH_CPF}
        onRegexError={handleIsRegexError}
        name="Insira registro do usuário"
        onChange={(e) =>
          handleSetEmployee({
            document: e.target.value,
          })
        }
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancelButton}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />

        <Button
          onPress={handleUpsertEmployee}
          disabled={!formStatus || disable}
          text={isRegister ? registerButton : updateButton}
          status={
            isRegister ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE
          }
        />
      </div>
    </div>
  );
}
