// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { PaginationDto } from "./pagination.dto";

export type GetBankDto = {
  id: string;
  name: string;
  createdAt: Date;
  agencies: string[];
};

export type CreateBankDto = {
  name: string;
  createdAt: Date;
  agencies: string[];
};

export type UpdateBankDto = {
  id: string;
  name?: string;
  createdAt?: Date;
  agencies?: string[];
};

export type BankWhere = Partial<GetBankDto>;

export type BankParams = PaginationDto<BankWhere, any, any, any>;

export type GetBankDtoParams = {
  count: number;
  banks: GetBankDto[];
};
