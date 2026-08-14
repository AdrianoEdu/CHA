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
    !!customer.customerType &&
    customer?.code.length === maxLength
  );
}
