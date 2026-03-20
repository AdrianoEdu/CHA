// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum, CustomerType } from "../constants/enum";

export type CreateCustomerDto = {
  name: string;
  code: string;
  customerType: CustomerType;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto> & {
  id: string;
};

export type GetCustomerDto = {
  id: string;
  name: string;
  code: string;
  customerType: CustomerType;
  createdAt: Date;
};

export type SendCreateCustomerDto = Partial<CreateCustomerDto> & {
  type: ActionEnum;
};
