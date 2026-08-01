// Copyright (c) 2026-08-01
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { GetBankDto } from "@/app/web/dto/bank.dto";

export type GetColumnsProps = {
  handleEdit: (row: GetBankDto) => void;
};