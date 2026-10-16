// Copyright (c) 2026-08-15
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { BodyPage } from "@/app/web/components/bodypage/bodypage";
import Button from "@/app/web/components/button/button";
import ComboBox from "@/app/web/components/combobox/combobox";
import { Footer } from "@/app/web/components/footer/footer";
import { Header } from "@/app/web/components/header/header";
import Input, { InputType } from "@/app/web/components/input/input";
import { EmployeePositionEnum } from "@/app/web/constants/enum";
import { Regex } from "@/app/web/constants/regex";
import { CreateEmployeeDto } from "@/app/web/dto/employee.dto";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import {
  GetEmployeePosition,
  validateEmployeeForm,
} from "@/app/web/utils/employee/employee";
import { JSX, useState } from "react";
import { toast } from "react-toastify";

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

const defaultEmployee: CreateEmployeeDto = {
  name: "",
  document: "",
  employeePositionId: "",
  dateOfBirth: new Date(),
};

const MAX_LENGTH_CPF = 14;

export default function RegisterEmployeeScreen(): JSX.Element {
  const [status, setStatus] = useState(true);
  const [disable, setDisable] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [employee, setEmployee] = useState<CreateEmployeeDto>(defaultEmployee);

  const formStatus = validateEmployeeForm({
    employee,
    maxLength: MAX_LENGTH_CPF,
  });

  const handleRegisterEmployee = async (): Promise<void> => {
    try {
      await employeeService.create(employee);
      toast.success("Funcionário registrado com sucesso");
      setEmployee(defaultEmployee);
    } catch (error) {
      toast.error(`Houve um problema ao registrar o functionário: ${error}`);
    }
  };

  const handleSetEmployee = (data: Partial<CreateEmployeeDto>): void => {
    setEmployee((prev) => ({ ...prev, ...data }));
  };

  const handleIsRegexError = (status: boolean) => setDisable(status);

  return (
    <div>
      <Header title="Novo funcionário" />

      <BodyPage>
        <Input
          className="flex-1"
          value={employee.name}
          label={"Nome do funcionário:"}
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
          label={"Data de nascimento:"}
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
          maxLength={MAX_LENGTH_CPF}
          onRegexError={handleIsRegexError}
          label="Documento:"
          onChange={(e) =>
            handleSetEmployee({
              document: e.target.value,
            })
          }
        />

        <ComboBox
          valueKey="id"
          labelKey="name"
          label="Cargo:"
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

        <Footer>
          <Button
            text="Registrar"
            onClick={handleRegisterEmployee}
            disabled={disable || !formStatus}
          />
        </Footer>
      </BodyPage>
    </div>
  );
}
