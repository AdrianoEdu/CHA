// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";

export type ReceivedCheckDTO = {
  id: string;
  receivedAt: string;
  customerId: string;
  customerName: string;
  bankId: string;
  bankName: string;
  agency: string;
  checkNumber: string;
  totalAmount: number;
  currentAmount: number;
  goodForAt?: Date;
  status: string;
  createdAt: Date;
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
  status?: string;
  goodForAt?: Date;
  customerId?: string;
  checkNumber?: string;
  totalAmount?: number;
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
