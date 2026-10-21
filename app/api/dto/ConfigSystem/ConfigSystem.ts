// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { TokenExpirationUnit } from "@/app/generated/prisma";

export type SystemConfigDto = {
  id?: string;
  enabled: boolean;
  runAtHour?: number | null;
  lastBackupAt?: Date | null;
  tokenExpirationValue: number;
  intervalHours?: number | null;
  tokenExpirationUnit: TokenExpirationUnit;
};
