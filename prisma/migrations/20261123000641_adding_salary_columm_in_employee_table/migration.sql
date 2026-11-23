/*
  Warnings:

  - Made the column `customerId` on table `BankStatement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `salary` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_customerId_fkey";

-- AlterTable
ALTER TABLE "BankStatement" ALTER COLUMN "customerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "salary" DECIMAL(12,2) NOT NULL;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
