// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type CreateAdvanceReasonDto = {
  name: string;
};

export type FindAdvanceReason = CreateAdvanceReasonDto & {
  id: string;
};
