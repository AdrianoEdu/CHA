// Copyright (c) 2026-04-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CheckUsageType } from "@/app/generated/prisma";
import { ReceivedCheckDTO } from "../ReceivedCheck/ReceivedCheck";
import { BankDto } from "../Bank/bank";
import { GetCustomerDto } from "../Customer/Customer";
import { GetTrasnactionDTO } from "../Transaction/Tansaction";

export type CheckUsageDTO = {
  id: string;
  usedAt: Date;
  amount: number;
  notes?: string;
  createdAt: Date;
  usageType: CheckUsageType;
  receivedCheck: ReceivedCheckDTO;
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
  notes?: string;
  amount?: number;
  transactionId?: string;
  receivedCheckId: string;
  usageType?: CheckUsageType;
};
