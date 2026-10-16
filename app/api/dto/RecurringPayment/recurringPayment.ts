// Copyright (c) 2026-10-13
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type CreateRecurringPaymentDto = {
  name: string;
  dueDay: number;
  isMonthly: boolean;
  fixedAmount?: number;
  isFixedAmount: boolean;
};

export type UpdateRecurringPaymentDto = Partial<CreateRecurringPaymentDto> & {
  id: string;
};

export type GetRecurringPaymentDto = {
  id: string;
  name: string;
  dueDay: number;
  createdAt: Date;
  updatedAt: Date;
  isMonthly: boolean;
  fixedAmount?: number;
  isFixedAmount: boolean;
};

export type GetRecurringPaymentDtoParams = {
  count: number;
  recurringPayment: GetRecurringPaymentDto[];
};

export type RemoverRecurringPaymentDto = {
  id: string;
};
