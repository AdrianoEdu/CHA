// Copyright (c) 2026-03-12
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export interface CreateBankDto {
  name: string;
  createdAt?: Date;
  agencies: string[];
}

export interface GetBankDto extends CreateBankDto {
  id?: string;
}

export type UpdateBankDto = Partial<GetBankDto>;

export type RemoveBankDto = {
  id: string;
};

export type GetBankDtoParams = {
  count: number;
  banks: GetBankDto[];
};
