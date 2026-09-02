-- CreateEnum
CREATE TYPE "CurrentAccountType" AS ENUM ('BANK', 'CASHBOOK');

-- AlterTable
ALTER TABLE "CurrentAccount" ADD COLUMN     "currentAccountType" "CurrentAccountType" NOT NULL DEFAULT 'BANK';
