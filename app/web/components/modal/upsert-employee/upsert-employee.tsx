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
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/app/web/dto/employee.dto";
import {
  GetEmployeePosition,
  validateEmployeeForm,
} from "@/app/web/utils/employee/employee";
import ComboBox from "../../combobox/combobox";
import { EmployeePositionEnum } from "@/app/web/constants/enum";

const { cancelButton, UpsertEmployee, registerButton, updateButton } =
  i18n["Pt-Br"].Modal;

const { inputNamePlaceholder } = UpsertEmployee;

type SelectOption = { id: string; name: string };

const employeePositionList: SelectOption[] = [
  {
    id: EmployeePositionEnum.ADMINISTRATIVE_ASSISTANT,
    name: GetEmployeePosition[EmployeePositionEnum.ADMINISTRATIVE_ASSISTANT],
  },
  {
    id: EmployeePositionEnum.CLEANING_ASSISTANT,
    name: GetEmployeePosition[EmployeePositionEnum.CLEANING_ASSISTANT],
  },
  {
    id: EmployeePositionEnum.MOTORBOY,
    name: GetEmployeePosition[EmployeePositionEnum.MOTORBOY],
  },
  {
    id: EmployeePositionEnum.OFFICE_ASSISTANT,
    name: GetEmployeePosition[EmployeePositionEnum.OFFICE_ASSISTANT],
  },
  {
    id: EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT,
    name: GetEmployeePosition[
      EmployeePositionEnum.PERSONNEL_DEPARTMENT_ASSISTANT
    ],
  },
  {
    id: EmployeePositionEnum.PERSONNEL_DEPARTMENT_MANAGER,
    name: GetEmployeePosition[
      EmployeePositionEnum.PERSONNEL_DEPARTMENT_MANAGER
    ],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N1,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N1],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N2,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N2],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N3,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N3],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N4,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N4],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N5,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N5],
  },
  {
    id: EmployeePositionEnum.TAX_ASSISTANT_N6,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_ASSISTANT_N6],
  },
  {
    id: EmployeePositionEnum.TAX_DEPARTMENT_MANAGER,
    name: GetEmployeePosition[EmployeePositionEnum.TAX_DEPARTMENT_MANAGER],
  },
];

export type UpsertEmployeeProps = {
  data?: UpdateEmployeeDto;
  onClose: () => void;
  onUpdate?: (data: UpdateEmployeeDto) => Promise<void>;
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
  const [showCalendar, setShowCalendar] = useState(false);

  const [employee, setEmployee] = useState<UpdateEmployeeDto>({
    id: data?.id ?? "",
    name: data?.name ?? "",
    document: data?.document ?? "",
    dateOfBirth: data?.dateOfBirth ?? new Date(),
    employeePositionId: data?.employeePositionId ?? "",
  });

  const isRegister = !data;

  const formStatus = validateEmployeeForm({
    maxLength: MAX_LENGTH_CPF,
    employee: { ...employee, employeePositionId: employee.employeePositionId },
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
          employeePositionId: employee.employeePositionId,
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
        employeePositionId: employee.employeePositionId,
      });
    }
  };

  const handleSetEmployee = (data: Partial<UpdateEmployeeDto>) => {
    setEmployee((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <div
      className={`
      flex flex-col w-full mt-5
      transition-[min-height] duration-300 ease-in-out
      ${showCalendar ? "min-h-125" : ""}
    `}
    >
      <div className="flex flex-col w-full gap-5">
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
          showCalendar={showCalendar}
          name="Data de nascimento:"
          value={employee.dateOfBirth}
          onValueChange={(currentDate) => {
            if (currentDate instanceof Date) {
              handleSetEmployee({
                dateOfBirth: currentDate,
              });
            }
          }}
          onCalendarVisibilityChange={setShowCalendar}
        />

        <Input
          className="flex-1"
          regex={Regex.onlyCPF}
          value={employee.document}
          inputType={InputType.CPF}
          name="CPF:"
          maxLength={MAX_LENGTH_CPF}
          onRegexError={handleIsRegexError}
          onChange={(e) =>
            handleSetEmployee({
              document: e.target.value,
            })
          }
        />

        <ComboBox
          valueKey="id"
          labelKey="name"
          selected={{
            id: employee.employeePositionId,
            name: GetEmployeePosition[
              employee.employeePositionId as EmployeePositionEnum
            ],
          }}
          options={employeePositionList}
          onSelectOption={(data) => {
            handleSetEmployee({ employeePositionId: data?.id });
          }}
        />
      </div>

      <div className="mt-auto pt-6 flex justify-end gap-4">
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
