// Copyright (c) 2026-03-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";

export type CreateAdvanceReasonDto = {
  name: string;
};

export type UpdateAdavanceReasonDto = Partial<CreateAdvanceReasonDto> & {
  id: string;
};

export type FindAdvanceReasonDto = CreateAdvanceReasonDto & {
  id: string;
  createdAt: Date;
};

export type SendAdvanceReasonDto = ActionDto & Partial<UpdateAdavanceReasonDto>;
