// Copyright (c) 2026-03-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { ActionDto } from "./auth.dto";

export interface PaginationDto {
  skip?: number;
  take?: number;
}

export interface SendPaginationDto extends ActionDto, PaginationDto {}
