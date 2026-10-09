// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ReceivedCheckStatus } from "@/app/generated/prisma";
import { GetBankDto } from "../Bank/bank";
import { GetCustomerDto } from "../Customer/Customer";

export type ReceivedCheckDTO = {
  id: string;
  amount: number;
  updatedAt: Date;
  createdAt: Date;
  agency: string;
  bank: GetBankDto;
  checkNumber: number;
  paidAt?: Date | null;
  notes?: string | null;
  goodForAt?: Date | null;
  customer: GetCustomerDto;
  status: ReceivedCheckStatus;
};

export type CreateReceivedCheckDTO = {
  bankId: string;
  agency: string;
  amount: number;
  notes?: string;
  goodForAt?: Date;
  customerId: string;
  checkNumber: number;
};

export type UpdateReceivedCheckDTO = {
  id: string;
  paidAt?: Date;
  amount: number;
  notes?: string;
  bankId?: string;
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: number;
  status?: ReceivedCheckStatus;
};

export type RemoveReceivedCheckDto = {
  id: string;
};

export type GetReceivedCheckDTOParams = {
  count: number;
  receivedChecks: ReceivedCheckDTO[];
};
