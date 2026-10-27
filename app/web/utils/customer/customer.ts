// Copyright (c) 2026-08-14
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CreateCustomerDto, UpdateCustomerDto } from "../../dto/customer.dto";

type ValidateCustomerFormProps = {
  customer: UpdateCustomerDto | CreateCustomerDto;
  maxLength: number;
};

export function validateCustomerForm({
  customer,
  maxLength,
}: ValidateCustomerFormProps): boolean {
  return (
    !!customer.numberId &&
    !!customer.name?.trim() &&
    !!customer.code?.trim() &&
    !!customer.phone?.trim() &&
    !!customer.email?.trim() &&
    !!customer.address?.trim() &&
    customer?.code.length === maxLength
  );
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (digits.length <= 2) {
    return `(${ddd}`;
  }

  if (number.startsWith("9")) {
    return `(${ddd}) ${number.slice(0, 5)}${
      number.length > 5 ? `-${number.slice(5, 9)}` : ""
    }`;
  }

  return `(${ddd}) ${number.slice(0, 4)}${
    number.length > 4 ? `-${number.slice(4, 8)}` : ""
  }`;
}
