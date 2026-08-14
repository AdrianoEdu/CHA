// Copyright (c) 2026-08-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { customerService } from "@/app/api/resources/customer/customer.service";
import { employeeService } from "@/app/api/resources/employee/employee.service";
import { BodyPage } from "@/app/web/components/bodypage/bodypage";
import Button from "@/app/web/components/button/button";
import ComboBox from "@/app/web/components/combobox/combobox";
import { Footer } from "@/app/web/components/footer/footer";
import { Header } from "@/app/web/components/header/header";
import Input, { InputType } from "@/app/web/components/input/input";
import { CustomerType } from "@/app/web/constants/enum";
import { i18n } from "@/app/web/constants/i18n";
import { Regex } from "@/app/web/constants/regex";
import { CreateCustomerDto } from "@/app/web/dto/customer.dto";
import { SelectComboboxProps } from "@/upsert-customer/page";
import React, { JSX, useState } from "react";
import { toast } from "react-toastify";

const customerTypeLabels: Record<CustomerType, string> = {
  CLIENT: "Cliente",
  SUPPLIER: "Fornecedor",
};

const options: SelectComboboxProps[] = (
  Object.values(CustomerType) as CustomerType[]
).map((type) => ({
  value: type,
  label: customerTypeLabels[type],
}));

const { RegisterEmployee, UpdateStatusEmployee, RemoveEmployee } =
  i18n["Pt-Br"].Modal;

const defaultCustomer = {
  code: "",
  customerType: CustomerType.CLIENT,
  name: "",
  numberId: 0,
};

export default function RegisterCustomer(): JSX.Element {
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);
  const [customer, setCustomer] = useState<CreateCustomerDto>(defaultCustomer);

  const handleRegisterCustomer = async (): Promise<void> => {
    await customerService.create(customer).then(() => {
      toast.success("Cliente registrado com sucesso");
      setCustomer(defaultCustomer);
    });
  };

  const handleSetCustomer = (data: Partial<CreateCustomerDto>): void => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  const handleSetCustomerName = (name: string): void =>
    handleSetCustomer({ name });

  const handleSetCustomerNumberId = (numberId: number): void =>
    handleSetCustomer({ numberId });

  const handleSetCustomerCode = (code: string) =>
    void handleSetCustomer({ code });

  return (
    <div>
      <Header title="Novo Cliente" />
      <BodyPage>
        <Input
          value={customer?.name}
          label="Nome do cliente:"
          onChange={(e) => handleSetCustomerName(e.target.value)}
        />
        <Input
          value={customer?.numberId}
          label="Código do cliente"
          onChange={(e) => handleSetCustomerNumberId(Number(e.target.value))}
        />
        <Input
          maxLength={14}
          className="flex-1"
          value={customer?.code}
          regex={Regex.onlyCNPJ}
          label={"Informe o CNPJ"}
          inputType={InputType.Cnpj}
          onChange={(e) => handleSetCustomerCode(e.target.value)}
          regexMessageError={"Por favor informar caracteres válidos"}
        />

        <ComboBox<SelectComboboxProps>
          options={options}
          valueKey={"value"}
          labelKey={"label"}
          selected={selected}
          onSelectOption={setSelected}
          label={"Informe o tipo de cliente"}
        />

        <Footer>
          <Button text="Registrar" onClick={handleRegisterCustomer} />
        </Footer>
      </BodyPage>
    </div>
  );
}
