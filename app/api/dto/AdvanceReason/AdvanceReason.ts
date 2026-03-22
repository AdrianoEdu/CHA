// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type CreateAdvanceReasonDto = {
  name: string;
};

export type FindAdvanceReasonDto = CreateAdvanceReasonDto & {
  id: string;
  createdAt: Date;
};

export type UpdateAdvanceReasonDto = Partial<CreateAdvanceReasonDto> & {
  id: string;
  createdAt?: Date;
};

export type FindAdvanceReasonByFilters = Partial<CreateAdvanceReasonDto> & {};

export type RemoveAdvanceReason = { id: string };
