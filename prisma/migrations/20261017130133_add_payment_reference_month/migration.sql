/*
  Warnings:

  - A unique constraint covering the columns `[recurringPaymentId,referenceMonth]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "referenceMonth" DATE;

-- CreateIndex
CREATE UNIQUE INDEX "payments_recurringPaymentId_referenceMonth_key" ON "payments"("recurringPaymentId", "referenceMonth");
