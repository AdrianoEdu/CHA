/*
  Warnings:

  - A unique constraint covering the columns `[receivedCheckId]` on the table `CashBook` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CashBook" ADD COLUMN     "receivedCheckId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CashBook_receivedCheckId_key" ON "CashBook"("receivedCheckId");

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_receivedCheckId_fkey" FOREIGN KEY ("receivedCheckId") REFERENCES "received_checks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
