// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CheckUsageType } from "@/app/generated/prisma";
import { ReceivedCheckDTO } from "../ReceivedCheck/ReceivedCheck";

export type CheckUsageDTO = {
  id: string;
  usedAt: Date;
  amount: number;
  notes?: string;
  createdAt: Date;
  usageType: CheckUsageType;
  receiveCheck: ReceivedCheckDTO;
};

export type CreateCheckUsageDTO = {
  usedAt: Date;
  notes?: string;
  amount: number;
  receivedCheckId: string;
  usageType: CheckUsageType;
};

export type UpdateCheckUsageDTO = {
  id: string;
  usedAt?: Date;
  amount?: number;
  notes?: string;
  receivedCheckId: string;
  usageType?: CheckUsageType;
};
