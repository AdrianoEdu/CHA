// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { UserRole } from "@/app/generated/prisma";
import { ActionEnum } from "../constants/enum";

export interface ActionDto {
  type?: ActionEnum;
}

export interface LoginDto extends ActionDto {
  login: string;
  password: string;
}

export interface AuthDto {
  name: string;
  role?: UserRole;
  lastName: string;
}
