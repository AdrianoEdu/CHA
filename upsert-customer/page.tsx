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

export function UpsertCustomer({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<RegisterCustomerProps>) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [disable, setDisable] = useState(false);
  const [identification, setIdentification] = useState("");
  const [selected, setSelected] = useState<SelectComboboxProps | null>(null);

  const isRegister = !data;

  useEffect(() => {
    if (isRegister) return;

    setName(data.name!);
    setCode(data.code!);
    setIdentification(data.numberId?.toString()!);
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
    const numberId = Number(identification);

    if (onUpdated) {
      onUpdated({
        id: data?.id!,
        code,
        name,
        numberId,
        customerType: selected?.value,
      });
      return;
    }

    if (onRegister)
      onRegister({
        code,
        name,
        numberId,
        customerType: selected?.value!,
      });
  };

  const handleIsRegexError = (status: boolean) => setDisable(status);

  return (
    <div className="flex flex-col w-full gap-2">
      <Input
        className="flex-1"
        disabled={!isRegister}
        value={identification}
        regex={Regex.onlyNumbers}
        onRegexError={handleIsRegexError}
        name={"Informe a identificação do cliente"}
        onChange={(e) => setIdentification(e.target.value)}
        regexMessageError={
          "Por favor informar caracteres válidos (apenas números)"
        }
      />

      <Input
        value={name}
        className="flex-1"
        name={"Informe o nome do cliente"}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        value={code}
        maxLength={14}
        className="flex-1"
        regex={Regex.onlyCNPJ}
        name={"Informe o CNPJ"}
        inputType={InputType.Cnpj}
        onRegexError={handleIsRegexError}
        onChange={(e) => setCode(e.target.value)}
        regexMessageError={"Por favor informar caracteres válidos"}
      />

      <ComboBox<SelectComboboxProps>
        options={options}
        valueKey={"value"}
        labelKey={"label"}
        selected={selected}
        onSelectOption={setSelected}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancelButton}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />
        <Button
          disabled={disable}
          onPress={handleUpsertCustomer}
          text={isRegister ? registerButton : updateButton}
          status={
            isRegister ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE
          }
        />
      </div>
    </div>
  );
}
