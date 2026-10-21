// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { TokenExpirationUnit } from "../constants/enum";

export type SystemConfigDto = {
  id?: string;
  enabled: boolean;
  runAtHour?: number;
  lastBackupAt?: string;
  intervalHours?: number;
  tokenExpirationValue: number;
  tokenExpirationUnit: TokenExpirationUnit;
};
