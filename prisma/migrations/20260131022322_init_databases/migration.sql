/*
  Warnings:

  - You are about to alter the column `amount` on the `employee_advances` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.
  - You are about to drop the `backup_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReceivedCheckStatus" AS ENUM ('RECEIVED', 'IN_USE', 'FINALIZED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckUsageType" AS ENUM ('DEPOSIT', 'PAYABLE');

-- CreateEnum
CREATE TYPE "FinancialFlowType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "FinancialStatus" AS ENUM ('OPEN', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('CLIENT', 'SUPPLIER', 'SERVICE', 'GOVERNMENT');

-- AlterTable
ALTER TABLE "employee_advances" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2);

-- DropTable
DROP TABLE "backup_config";

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "type" "CustomerType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agencies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "received_checks" (
    "id" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "checkNumber" TEXT NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "currentAmount" DECIMAL(15,2) NOT NULL,
    "goodForAt" TIMESTAMP(3),
    "status" "ReceivedCheckStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "received_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_usages" (
    "id" TEXT NOT NULL,
    "receivedCheckId" TEXT NOT NULL,
    "usageType" "CheckUsageType" NOT NULL,
    "referenceTable" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "financialFlowType" "FinancialFlowType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_payables" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "FinancialStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "accounts_payables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_receivables" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "status" "FinancialStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "accounts_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "intervalHours" INTEGER NOT NULL,
    "runAtHour" INTEGER,
    "lastBackupAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "received_checks" ADD CONSTRAINT "received_checks_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "received_checks" ADD CONSTRAINT "received_checks_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_usages" ADD CONSTRAINT "check_usages_receivedCheckId_fkey" FOREIGN KEY ("receivedCheckId") REFERENCES "received_checks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_payables" ADD CONSTRAINT "accounts_payables_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_payables" ADD CONSTRAINT "accounts_payables_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_receivables" ADD CONSTRAINT "accounts_receivables_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_receivables" ADD CONSTRAINT "accounts_receivables_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
