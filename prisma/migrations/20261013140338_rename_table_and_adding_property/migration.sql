/*
  Warnings:

  - You are about to drop the `accounts-payable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "accounts-payable";

-- CreateTable
CREATE TABLE "recurring-payment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isMonthly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring-payment_pkey" PRIMARY KEY ("id")
);
