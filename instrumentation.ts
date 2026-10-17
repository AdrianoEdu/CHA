// Copyright (c) 2026-10-17
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startRecurringPaymentCron } =
      await import("./app/api/resources/recurring-payment/recurring-payment-cron");

    startRecurringPaymentCron();
  }
}
