// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { BankDto } from "@/app/api/dto/Bank/bank";
import { ReceivedCheckStatus } from "../constants/enum";
import { ActionDto } from "./auth.dto";
import { GetBankDto } from "./bank.dto";
import { GetCustomerDto } from "./customer.dto";
import { PaginationDto } from "./pagination.dto";

export type ReceivedCheckDTO = {
  id: string;
  agency: string;
  createdAt: Date;
  bank: GetBankDto;
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
  bank?: BankDto;
  bankId?: string;
  agency?: string;
  status?: string;
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: string;
  totalAmount?: number;
  currentAmount?: number;
  customer?: GetCustomerDto;
};

export type RemoveReceivedCheckDto = {
  id: string;
};

export type UpsertReceivedCheckDto = CreateReceivedCheckDTO &
  UpdateReceivedCheckDTO;

export type ReceivedCheckWhere = Partial<GetCustomerDto>;

export type ReceivedCheckParams = PaginationDto<
  ReceivedCheckWhere,
  any,
  any,
  any
>;
