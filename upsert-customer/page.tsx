// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { useEffect, useState } from "react";
import Input, { InputType } from "../app/web/components/input/input";
import { Regex } from "@/app/web/constants/regex";
import ComboBox from "../app/web/components/combobox/combobox";
import { CustomerType } from "@/app/web/constants/enum";
import Button, { ButtonStatusEnum } from "../app/web/components/button/button";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/app/web/dto/customer.dto";
import { validateIsNan } from "@/app/web/utils/validateParameters";
import { validateCustomerForm } from "@/app/web/utils/customer/customer";
import { Toggle } from "@/app/web/components/toggle/toggle";

export type SelectComboboxProps = {
  label: string;
  value: CustomerType;
};

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

type RegisterCustomerProps = {
  data?: UpdateCustomerDto;
  onClose: () => void;
  onUpdated?: (data: UpdateCustomerDto) => void;
  onRegister?: (data: CreateCustomerDto) => void;
};

const { cancelButton, registerButton, updateButton } = i18n["Pt-Br"].Modal;

const labelCNPJ = "Informe o CNPJ";
const labelCPF = "Informe o CPF";

export function UpsertCustomer({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<RegisterCustomerProps>) {
  const [status, setStatus] = useState(false);
  const [disable, setDisable] = useState(false);
  const [customer, setCustomer] = useState<UpdateCustomerDto>({ id: "" });
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);

  const isRegister = !data;

  const { inputType, label, regex, maxLength } = {
    maxLength: status ? 18 : 14,
    label: status ? labelCNPJ : labelCPF,
    regex: status ? Regex.onlyCNPJ : Regex.onlyCPF,
    inputType: status ? InputType.Cnpj : InputType.CPF,
  };

  const formStatus = validateCustomerForm({ customer, maxLength });

  const handleSetStatus = (status: boolean): void => {
    setStatus(status);
    handleSetCustomer({ code: "" });
  };

  useEffect(() => {
    if (isRegister) return;

    setCustomer({
      id: data.id,
      name: data.name,
      code: data.code,
      numberId: data.numberId,
      customerType: data.customerType,
    });

    setSelected(
      data.customerType
        ? {
            label: customerTypeLabels[data.customerType],
            value: data.customerType,
          }
        : null,
    );
  }, [data]);

  const handleUpsertCustomer = (): void => {
    if (!isRegister && onUpdated) {
      onUpdated(customer);
      return;
    }

    if (onRegister)
      onRegister({
        name: customer.name ?? "",
        code: customer?.code ?? "",
        numberId: customer.numberId ?? 0,
        customerType: customer.customerType ?? CustomerType.CLIENT,
      });
  };

  const handleSelectOption = (data: SelectComboboxProps | null): void => {
    setSelected(data);
    handleSetCustomer({ customerType: data?.value });
  };

  const handleIsRegexError = (status: boolean) => setDisable(status);

  const handleSetCustomer = (data: Partial<UpdateCustomerDto>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Toggle
        value={status}
        onChange={handleSetStatus}
        title={"Pessoal jurídica?"}
      />

      <Input
        className="flex-1"
        disabled={!isRegister}
        value={customer.numberId}
        regex={Regex.onlyNumbers}
        onRegexError={handleIsRegexError}
        name={"Informe a identificação do cliente"}
        regexMessageError={
          "Por favor informar caracteres válidos (apenas números)"
        }
        onChange={(e) =>
          handleSetCustomer({ numberId: validateIsNan(Number(e.target.value)) })
        }
      />

      <Input
        className="flex-1"
        value={customer.name}
        name={"Informe o nome do cliente"}
        onChange={(e) => handleSetCustomer({ name: e.target.value })}
      />

      <Input
        className="flex-1"
        name={label}
        regex={regex}
        maxLength={maxLength}
        value={customer.code}
        inputType={inputType}
        onRegexError={handleIsRegexError}
        regexMessageError={"Por favor informar caracteres válidos"}
        onChange={(e) => handleSetCustomer({ code: e.target.value })}
      />

      <ComboBox<SelectComboboxProps>
        options={options}
        valueKey={"value"}
        labelKey={"label"}
        selected={selected}
        onSelectOption={handleSelectOption}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancelButton}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />
        <Button
          onPress={handleUpsertCustomer}
          disabled={disable || !formStatus}
          text={isRegister ? registerButton : updateButton}
          status={
            isRegister ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE
          }
        />
      </div>
    </div>
  );
}
