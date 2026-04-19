/*
  Warnings:

  - You are about to drop the `accounts_payables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `accounts_receivables` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYABLE', 'RECEIVABLE');

-- DropForeignKey
ALTER TABLE "accounts_payables" DROP CONSTRAINT "accounts_payables_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "accounts_payables" DROP CONSTRAINT "accounts_payables_customerId_fkey";

-- DropForeignKey
ALTER TABLE "accounts_receivables" DROP CONSTRAINT "accounts_receivables_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "accounts_receivables" DROP CONSTRAINT "accounts_receivables_customerId_fkey";

-- DropTable
DROP TABLE "accounts_payables";

-- DropTable
DROP TABLE "accounts_receivables";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
