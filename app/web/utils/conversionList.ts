// Copyright (c) 2026-04-08
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { CheckUsageType, ReceivedCheckStatus } from "../constants/enum";

type SelectOption = { id: string; name: string };

export function sortStringNumbers(list: string[]): string[] {
  return list
    .map((item) => Number(item))
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b)
    .map((num) => String(num));
}

export function getListStatusReceiveCheck(): SelectOption[] {
  const enums = Object.values(ReceivedCheckStatus);

  return enums.map((status) => {
    switch (status) {
      case ReceivedCheckStatus.CANCELLED:
        return {
          id: ReceivedCheckStatus.CANCELLED,
          name: "Cancelado",
        };
      case ReceivedCheckStatus.FINALIZED:
        return {
          id: ReceivedCheckStatus.FINALIZED,
          name: "Finalizado",
        };
      case ReceivedCheckStatus.RECEIVED:
        return {
          id: ReceivedCheckStatus.RECEIVED,
          name: "Recebido",
        };

      default:
        return {
          id: ReceivedCheckStatus.IN_USE,
          name: "Em Uso",
        };
    }
  });
}

export function getListStatusCheckUsage(): SelectOption[] {
  const enums = Object.values(CheckUsageType);

  return enums.map((status) => {
    switch (status) {
      case CheckUsageType.DEPOSIT:
        return {
          id: CheckUsageType.DEPOSIT,
          name: "Cancelado",
        };

      default:
        return {
          id: CheckUsageType.PAYABLE,
          name: "Contas a pagar",
        };
    }
  });
}
