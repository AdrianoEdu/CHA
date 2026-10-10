// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ReceivedCheckStatus } from "../constants/enum";
import { GetBankDto } from "./bank.dto";
import { GetCustomerDto } from "./customer.dto";
import { PaginationDto } from "./pagination.dto";

export type ReceivedCheckDTO = {
  id: string;
  amount: number;
  paidAt?: Date;
  notes?: string;
  agency?: string;
  updatedAt: Date;
  createdAt: Date;
  bank: GetBankDto;
  goodForAt?: Date;
  checkNumber: number;
  customer: GetCustomerDto;
  status: ReceivedCheckStatus;
};

export type CreateReceivedCheckDTO = {
  bankId: string;
  amount: number;
  notes?: string;
  agency?: string;
  goodForAt?: Date;
  customerId: string;
  checkNumber: number;
};

export type UpdateReceivedCheckDTO = {
  id: string;
  paidAt?: Date;
  amount: number;
  notes?: string;
  agency?: string;
  bankId?: string;
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: number;
  status?: ReceivedCheckStatus;
};

export type RemoveReceivedCheckDto = {
  id: string;
};

export type ReceivedCheckWhere = Partial<ReceivedCheckDTO>;

export type ReceivedCheckParams = PaginationDto<
  ReceivedCheckWhere,
  any,
  any,
  any
>;

export type GetReceivedCheckParamsDto = {
  count: number;
  receivedChecks: ReceivedCheckDTO[];
};
