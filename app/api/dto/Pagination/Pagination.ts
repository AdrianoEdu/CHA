// Copyright (c) 2026-04-21
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type PaginationDto<WHERE, SELECT, INCLUDE, ORDERBY> = {
  skip?: number;
  take?: number;
  all?: boolean;
  where?: WHERE;
  select?: SELECT;
  include?: INCLUDE;
  orderBy?: ORDERBY;
  lastSynced?: string;
};
