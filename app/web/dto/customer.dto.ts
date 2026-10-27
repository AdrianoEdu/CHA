// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PaginationDto } from "./pagination.dto";

export type CreateCustomerDto = {
  name: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  numberId: number;
};

export type UpdateCustomerDto = Partial<CreateCustomerDto> & {
  id: string;
};

export type GetCustomerDto = {
  id: string;
  name: string;
  code: string;
  phone: string;
  email: string;
  createdAt: Date;
  address: string;
  numberId: number;
  isActive: boolean;
};

export type GetCustomerDtoParams = {
  count: number;
  customers: GetCustomerDto[];
};

export type CustomerWhere = Partial<GetCustomerDto>;

export type CustomerParams = PaginationDto<CustomerWhere, any, any, any>;
