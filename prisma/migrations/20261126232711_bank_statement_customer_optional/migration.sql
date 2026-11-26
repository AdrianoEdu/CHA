-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_customerId_fkey";

-- AlterTable
ALTER TABLE "BankStatement" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
