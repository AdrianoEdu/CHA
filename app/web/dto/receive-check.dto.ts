// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ReceivedCheckStatus } from "../constants/enum";
import { ActionDto } from "./auth.dto";
import { GetBankDto } from "./bank.dto";
import { GetCustomerDto } from "./customer.dto";

export type ReceivedCheckDTO = {
  id: string;
  bank: GetBankDto;
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
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: string;
  totalAmount?: number;
  currentAmount?: number;
};

export type RemoveReceivedCheckDto = {
  id: string;
};

export type UpsertReceivedCheckDto = CreateReceivedCheckDTO &
  UpdateReceivedCheckDTO;

export interface SendUpdateReceiveCheckDto
  extends ActionDto, UpdateReceivedCheckDTO {}

export interface SendCreateReceiveCheckDto
  extends ActionDto, CreateReceivedCheckDTO {}
