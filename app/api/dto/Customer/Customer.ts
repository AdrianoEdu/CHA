// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { Customer, CustomerType } from "@/app/generated/prisma";

export type CreateCustomerDto = {
  name: string;
  code: string;
  numberId: number;
  customerType: CustomerType;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto> & {
  id: string;
};

export type GetCustomerDto = {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  numberId: number;
  isActive: boolean;
  customerType: CustomerType;
};

export type RemoverCustomerDto = {
  id: string;
};
