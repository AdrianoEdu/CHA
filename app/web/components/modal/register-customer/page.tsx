// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { useState } from "react";
import Input, { InputType } from "../../input/page";
import { Regex } from "@/app/web/constants/regex";
import { FormatterResult } from "@/app/web/utils/inputFormatter";
import ComboBox from "../../combobox/page";
import { CustomerType } from "@/app/web/constants/enum";
import Button from "../../button/page";
import { i18n } from "@/app/web/constants/i18n";
import { CreateCustomerDto } from "@/app/web/dto/customer.dto";

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
  onClose: () => void;
  onRegister: (data: CreateCustomerDto) => void;
};

const { cancelButton, registerButton } = i18n["Pt-Br"].Modal;

export function RegisterCustomer({
  onClose,
  onRegister,
}: Readonly<RegisterCustomerProps>) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [showErrorRegex, setShowErrorRegex] = useState(false);
  const [selected, setSelected] = useState<SelectComboboxProps>();

  const handleRegisterCustomer = (): void => {
    onRegister({ code, name, customerType: selected?.value! });
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        value={name}
        className="flex-1"
        regex={Regex.onlyText}
        regexError={showErrorRegex}
        onRegexError={setShowErrorRegex}
        name={"Informe o nome do cliente"}
        onChange={(e) => setName(e.target.value)}
        regexMessageError={
          "Por favor informar caracteres válidos (apenas texto)"
        }
      />

      <Input
        value={code}
        maxLength={14}
        className="flex-1"
        regex={Regex.onlyCNPJ}
        name={"Informe o CNPJ"}
        inputType={InputType.Cnpj}
        regexError={showErrorRegex}
        onRegexError={setShowErrorRegex}
        onChange={(e) => setCode(e.target.value)}
        regexMessageError={"Por favor informar caracteres válidos"}
      />

      <ComboBox
        options={options}
        valueKey={"value"}
        labelKey={"label"}
        selected={selected}
        onSelectOption={setSelected}
      />
      <div className="mt-6 flex justify-end gap-4">
        <Button text={cancelButton} onPress={onClose} />
        <Button
          text={registerButton}
          disabled={showErrorRegex}
          onPress={handleRegisterCustomer}
        />
      </div>
    </div>
  );
}
