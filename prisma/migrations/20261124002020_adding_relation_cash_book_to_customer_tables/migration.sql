/*
  Warnings:

  - Added the required column `customerId` to the `CashBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashBook" ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
