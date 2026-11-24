-- DropForeignKey
ALTER TABLE "CashBook" DROP CONSTRAINT "CashBook_customerId_fkey";

-- AlterTable
ALTER TABLE "CashBook" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
