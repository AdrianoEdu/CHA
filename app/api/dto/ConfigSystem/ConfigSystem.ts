// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type SystemConfigDto = {
  id?: string;
  enabled: boolean;
  intervalHours?: number | null;
  runAtHour?: number | null;
  lastBackupAt?: Date | null;
};
