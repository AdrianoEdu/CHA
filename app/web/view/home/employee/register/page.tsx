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
import { Toggle } from "@/app/web/components/toggle/toggle";
import { CustomerType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { Regex } from "@/app/web/constants/regex";
import { CreateCustomerDto } from "@/app/web/dto/customer.dto";
import { CreateEmployeeDto } from "@/app/web/dto/employee.dto";
import { customerService } from "@/app/web/services/customerService/customerService";
import { employeeService } from "@/app/web/services/employeeService/employeeService";
import { validateCustomerForm } from "@/app/web/utils/customer/customer";
import { validateEmployeeForm } from "@/app/web/utils/employee/employee";
import { validateIsNan } from "@/app/web/utils/validateParameters";
import { SelectComboboxProps } from "@/upsert-customer/page";
import React, { JSX, useState } from "react";
import { toast } from "react-toastify";

const defaultEmployee = {
  name: "",
  document: "",
  dateOfBirth: new Date(),
};

const MAX_LENGTH_CPF = 14;

const { cancelButton, RegisterEmployee, registerButton, updateButton } =
  i18n["Pt-Br"].Modal;

const { inputNamePlaceholder } = RegisterEmployee;

export default function RegisterEmployeeScreen(): JSX.Element {
  const [status, setStatus] = useState(true);
  const [disable, setDisable] = useState(false);
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
          label="Data de nascimento:"
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
          label="Documento:"
          onChange={(e) =>
            handleSetEmployee({
              document: e.target.value,
            })
          }
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
