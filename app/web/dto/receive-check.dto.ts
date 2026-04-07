// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

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
  goodForAt: string | null;
  status: string;
  createdAt: Date;
};

export type CreateReceivedCheckDTO = {
  customerId: string;
  bankId: string;
  agency: string;
  checkNumber: string;
  totalAmount: number;
  goodForAt?: string | null;
};

export type UpdateReceivedCheckDTO = {
  id: string;
  customerId?: string;
  bankId?: string;
  agency?: string;
  checkNumber?: string;
  totalAmount?: number;
  goodForAt?: string | null;
  status?: string;
};

export type RemoveReceivedCheckDto = {
  id: string;
};
