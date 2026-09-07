/*
  Warnings:

  - You are about to drop the column `currentAccountId` on the `BankStatement` table. All the data in the column will be lost.
  - You are about to drop the column `currentAccountId` on the `CashBook` table. All the data in the column will be lost.
  - You are about to drop the `CurrentAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `BankStatement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `CashBook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BANK', 'CASHBOOK');

-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_currentAccountId_fkey";

-- DropForeignKey
ALTER TABLE "CashBook" DROP CONSTRAINT "CashBook_currentAccountId_fkey";

-- DropForeignKey
ALTER TABLE "CurrentAccount" DROP CONSTRAINT "CurrentAccount_bankId_fkey";

-- AlterTable
ALTER TABLE "BankStatement" DROP COLUMN "currentAccountId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CashBook" DROP COLUMN "currentAccountId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CurrentAccount";

-- DropEnum
DROP TYPE "CurrentAccountType";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "accountNumber" TEXT,
    "accountType" "AccountType" NOT NULL DEFAULT 'BANK',
    "bankId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
