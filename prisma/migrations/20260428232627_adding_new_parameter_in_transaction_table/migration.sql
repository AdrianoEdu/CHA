/*
  Warnings:

  - Added the required column `currentAmount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('CREATED', 'IN_USE', 'FINALIZED');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "currentAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'CREATED';
