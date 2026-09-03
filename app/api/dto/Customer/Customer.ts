// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type CreateCustomerDto = {
  name: string;
  code: string;
  numberId: number;
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
};

export type GetCustomerDtoParams = {
  count: number;
  customers: GetCustomerDto[];
};

export type RemoverCustomerDto = {
  id: string;
};
