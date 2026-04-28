/*
  Warnings:

  - Added the required column `transactionId` to the `check_usages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_usages" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "check_usages" ADD CONSTRAINT "check_usages_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
