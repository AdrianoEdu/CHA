// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import cron from "node-cron";
import { recurringPaymentService } from "./recurring-payment.service";

let started = false;
let running = false;

async function processRecurringPayments(): Promise<void> {
  if (running) return;

  running = true;

  try {
    const result = await recurringPaymentService.generateMonthlyPayments();

    console.log(`[Recurring Payment Cron] Pagamentos gerados: ${result.count}`);
  } catch (error) {
    console.error("[Recurring Payment Cron] Erro ao gerar pagamentos:", error);
  } finally {
    running = false;
  }
}

export function startRecurringPaymentCron(): void {
  if (started) return;

  started = true;

  void processRecurringPayments();

  cron.schedule(
    "5 0 * * *",
    async () => {
      await processRecurringPayments();
    },
    {
      timezone: "America/Sao_Paulo",
    },
  );

  console.log("[Recurring Payment Cron] Agendado para diariamente às 00:05.");
}
