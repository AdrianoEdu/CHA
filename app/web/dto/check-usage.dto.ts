// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CheckUsageType } from "../constants/enum";
import { ActionDto } from "./auth.dto";
import { PaginationDto } from "./pagination.dto";
import { ReceivedCheckDTO } from "./receive-check.dto";
import { GetTrasnactionDTO } from "./transaction.dto";

export type CheckUsageDTO = {
  id: string;
  usedAt: Date;
  amount: number;
  notes?: string;
  createdAt: Date;
  usageType: CheckUsageType;
  receivedCheck: Partial<ReceivedCheckDTO>;
  transaction: Partial<GetTrasnactionDTO>;
};

export type CreateCheckUsageDTO = {
  usedAt: Date;
  notes?: string;
  amount: number;
  transactionId: string;
  receivedCheckId: string;
  usageType: CheckUsageType;
};

export type UpdateCheckUsageDTO = {
  id: string;
  usedAt?: Date;
  amount?: number;
  notes?: string;
  receivedCheckId?: string;
  usageType?: CheckUsageType;
};

export type UpsertCheckUsageDTO = CreateCheckUsageDTO & UpdateCheckUsageDTO;

export type CheckUsageWhere = Partial<CheckUsageDTO>;

export type CheckUsageParams = PaginationDto<CheckUsageWhere, any, any, any>;
