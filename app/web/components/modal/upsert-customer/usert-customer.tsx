// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { useEffect, useState } from "react";
import Input, { InputType } from "../../input/input";
import { Regex } from "@/app/web/constants/regex";
import Button, { ButtonStatusEnum } from "../../button/button";
import { i18n } from "@/app/web/constants/i18n";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/app/web/dto/customer.dto";
import { validateIsNan } from "@/app/web/utils/validateParameters";
import { validateCustomerForm } from "@/app/web/utils/customer/customer";
import { Toggle } from "@/app/web/components/toggle/toggle";

type RegisterCustomerProps = {
  data?: UpdateCustomerDto;
  onClose: () => void;
  onUpdated?: (data: UpdateCustomerDto) => void;
  onRegister?: (data: CreateCustomerDto) => void;
};

const { cancel, register, update } = i18n["Pt-Br"].Components.Modal.Generic;
const { fields, regex: regexKey } = i18n["Pt-Br"].Components.Modal.UpsertCustomer;

export default function UpsertCustomerModal({
  data,
  onClose,
  onUpdated,
  onRegister,
}: Readonly<RegisterCustomerProps>) {
  const [status, setStatus] = useState(false);
  const [disable, setDisable] = useState(false);
  const [customer, setCustomer] = useState<UpdateCustomerDto>({ id: "" });
  const isRegister = !data;

  const { inputType, label, regex, maxLength } = {
    maxLength: status ? 18 : 14,
    label: status ? fields.labelCNPJ : fields.labelCPF,
    regex: status ? Regex.onlyCNPJ : Regex.onlyCPF,
    inputType: status ? InputType.Cnpj : InputType.CPF,
  };

  const formStatus = validateCustomerForm({ customer, maxLength });

  const handleSetStatus = (status: boolean): void => {
    setStatus(status);
    handleSetCustomer({ code: "" });
  };

  useEffect(() => {
    if (!data) return;

    setCustomer({
      id: data.id,
      name: data.name,
      code: data.code,
      numberId: data.numberId,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    setStatus((data.code?.length ?? 0) > 14);
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
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
        numberId: customer.numberId ?? 0,
      });
  };

  const handleIsRegexError = (status: boolean) => setDisable(status);

  const handleSetCustomer = (data: Partial<UpdateCustomerDto>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <Toggle
        value={status}
        onChange={handleSetStatus}
        title={fields.toggleLegalEntity}
      />

      <Input
        className="flex-1"
        disabled={!isRegister}
        value={customer.numberId}
        regex={Regex.onlyNumbers}
        onRegexError={handleIsRegexError}
        name={fields.identification}
        regexMessageError={
          regexKey.error.identificationRegexOnlyNumbers
        }
        onChange={(e) =>
          handleSetCustomer({ numberId: validateIsNan(Number(e.target.value)) })
        }
      />

      <Input
        className="flex-1"
        name={fields.name}
        value={customer.name}
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
        regexMessageError={regexKey.error.generic}
        onChange={(e) => handleSetCustomer({ code: e.target.value })}
      />

      <Input
        name={fields.phone}
        value={customer.phone}
        regex={Regex.onlyNumbers}
        inputType={InputType.Phone}
        onRegexError={handleIsRegexError}
        regexMessageError={regexKey.error.phoneRegex}
        onValueChange={(value: any) => handleSetCustomer({ phone: value })}
      />

      <Input
        name={fields.email}
        value={customer.email}
        regex={Regex.onlyEmail}
        inputType={InputType.Email}
        regexMessageError={regexKey.error.email}
        onRegexError={handleIsRegexError}
        onValueChange={(value: any) => handleSetCustomer({ email: value })}
      />

      <Input
        className="flex-1"
        value={customer.address}
        name={fields.address}
        onChange={(e) => handleSetCustomer({ address: e.target.value })}
      />

      <div className="mt-6 flex justify-end gap-4">
        <Button
          text={cancel}
          onPress={onClose}
          status={ButtonStatusEnum.CANCEL}
        />
        <Button
          onPress={handleUpsertCustomer}
          disabled={disable || !formStatus}
          text={isRegister ? register : update}
          status={
            isRegister ? ButtonStatusEnum.CONFIRM : ButtonStatusEnum.UPDATE
          }
        />
      </div>
    </div>
  );
}
