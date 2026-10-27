// Copyright (c) 2026-08-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { BodyPage } from "@/app/web/components/bodypage/bodypage";
import Button from "@/app/web/components/button/button";
import { Footer } from "@/app/web/components/footer/footer";
import { Header } from "@/app/web/components/header/header";
import Input, { InputType } from "@/app/web/components/input/input";
import { Toggle } from "@/app/web/components/toggle/toggle";
import { Regex } from "@/app/web/constants/regex";
import { CreateCustomerDto } from "@/app/web/dto/customer.dto";
import { customerService } from "@/app/web/services/customerService/customerService";
import { validateCustomerForm } from "@/app/web/utils/customer/customer";
import { validateIsNan } from "@/app/web/utils/validateParameters";
import { JSX, useState } from "react";
import { toast } from "react-toastify";

const defaultCustomer = {
  code: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  numberId: 0,
};

const labelCNPJ = "Informe o CNPJ";
const labelCPF = "Informe o CPF";

export default function RegisterCustomer(): JSX.Element {
  const [status, setStatus] = useState(true);
  const [disable, setDisable] = useState(false);
  const [customer, setCustomer] = useState<CreateCustomerDto>(defaultCustomer);

  const { inputType, label, regex, maxLength } = {
    maxLength: status ? 18 : 14,
    label: status ? labelCNPJ : labelCPF,
    regex: status ? Regex.onlyCNPJ : Regex.onlyCPF,
    inputType: status ? InputType.Cnpj : InputType.CPF,
  };

  const formStatus = validateCustomerForm({ customer, maxLength });

  const handleRegisterCustomer = async (): Promise<void> => {
    try {
      await customerService.create(customer);
      toast.success("Cliente registrado com sucesso");
      setCustomer(defaultCustomer);
    } catch (error) {
      toast.error(`Houve um problema ao registrar o cliente: ${error}`);
    }
  };

  const handleSetCustomer = (data: Partial<CreateCustomerDto>): void => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  const handleIsRegexError = (status: boolean) => setDisable(status);

  const handleSetStatus = (status: boolean): void => {
    setStatus(status);
    handleSetCustomer({ code: "" });
  };

  return (
    <div>
      <Header title="Novo cliente" />

      <BodyPage>
        <Toggle
          value={status}
          onChange={handleSetStatus}
          title={"Pessoal jurídica?"}
        />

        <Input
          value={customer?.name}
          label={"Nome do cliente:"}
          onChange={(e) => handleSetCustomer({ name: e.target.value })}
        />

        <Input
          maxLength={10}
          label="Código do cliente"
          value={customer?.numberId}
          onRegexError={handleIsRegexError}
          onChange={(e) =>
            handleSetCustomer({
              numberId: validateIsNan(Number(e.target.value)),
            })
          }
        />

        <Input
          label={label}
          regex={regex}
          className="flex-1"
          maxLength={maxLength}
          inputType={inputType}
          value={customer?.code}
          regexMessageError={"Por favor informar caracteres válidos"}
          onChange={(e) => handleSetCustomer({ code: e.target.value })}
        />

        <Input
          label={"Inserir telefone"}
          value={customer.phone}
          regex={Regex.onlyNumbers}
          inputType={InputType.Phone}
          regexMessageError="Informe número válido."
          onRegexError={handleIsRegexError}
          onValueChange={(value: any) => handleSetCustomer({ phone: value })}
        />

        <Input
          value={customer.email}
          regex={Regex.onlyEmail}
          label={"Inserir o email"}
          inputType={InputType.Email}
          onRegexError={handleIsRegexError}
          regexMessageError="Informe um e-mail válido."
          onValueChange={(value: any) => handleSetCustomer({ email: value })}
        />

        <Input
          className="flex-1"
          value={customer.address}
          label={"Inserir endereço:"}
          onChange={(e) => handleSetCustomer({ address: e.target.value })}
        />

        <Footer>
          <Button
            text="Registrar"
            onClick={handleRegisterCustomer}
            disabled={disable || !formStatus}
          />
        </Footer>
      </BodyPage>
    </div>
  );
}
