// Copyright (c) 2026-03-18
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionEnum, CustomerType } from "../constants/enum";
import { PaginationDto } from "./pagination.dto";

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

export type CustomerWhere = Partial<GetCustomerDto>;

export type CustomerParams = PaginationDto<CustomerWhere, any, any, any>;
