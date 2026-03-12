// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export interface BankDto {
  id?: string;
  name: string;
  createdAt?: Date;
  agencies: string[];
}

export type UpdateBankDto = Partial<BankDto>;
