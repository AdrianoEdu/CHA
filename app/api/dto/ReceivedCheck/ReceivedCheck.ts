// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ReceivedCheckStatus } from "@/app/generated/prisma";
import { BankDto } from "../Bank/bank";
import { GetCustomerDto } from "../Customer/Customer";

export type ReceivedCheckDTO = {
  id: string;
  bank: BankDto;
  agency: string;
  createdAt: Date;
  goodForAt?: Date;
  checkNumber: string;
  totalAmount: number;
  currentAmount: number;
  customer: GetCustomerDto;
  status: ReceivedCheckStatus;
};

export type CreateReceivedCheckDTO = {
  bankId: string;
  agency: string;
  customerId: string;
  goodForAt?: Date;
  checkNumber: string;
  totalAmount: number;
  currentAmount: number;
};

export type UpdateReceivedCheckDTO = {
  id: string;
  bankId?: string;
  agency?: string;
  status?: string;
  goodForAt?: string;
  customerId?: string;
  checkNumber?: string;
  totalAmount?: number;
  currentAmount?: number;
};

export type RemoveReceivedCheckDto = {
  id: string;
};
