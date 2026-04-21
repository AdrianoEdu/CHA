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

export type CreateBankDtp = {
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
