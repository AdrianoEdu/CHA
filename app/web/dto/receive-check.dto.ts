// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ReceivedCheckStatus } from "../constants/enum";
import { ActionDto } from "./auth.dto";

export type ReceivedCheckDTO = {
  id: string;
  bankId: string;
  agency: string;
  createdAt: Date;
  bankName: string;
  goodForAt?: Date;
  receivedAt: string;
  customerId: string;
  checkNumber: string;
  totalAmount: number;
  customerName: string;
  currentAmount: number;
  status: ReceivedCheckStatus;
};

export type CreateReceivedCheckDTO = {
  customerId: string;
  bankId: string;
  agency: string;
  checkNumber: string;
  totalAmount: number;
  goodForAt?: Date;
};

export type UpdateReceivedCheckDTO = {
  id?: string;
  bankId?: string;
  agency?: string;
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: string;
  totalAmount?: number;
  status?: ReceivedCheckStatus;
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
