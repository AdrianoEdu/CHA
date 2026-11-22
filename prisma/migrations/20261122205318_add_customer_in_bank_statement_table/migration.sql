/*
  Warnings:

  - The values [EMPLOYEE_SALARY] on the enum `RecurringPaymentDateType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fixedAmount` on the `recurring-payment` table. All the data in the column will be lost.
  - You are about to drop the column `isFixedAmount` on the `recurring-payment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecurringPaymentDateType_new" AS ENUM ('FIXED_DAY', 'BIWEEKLY', 'FIFTH_BUSINESS_DAY');
ALTER TABLE "recurring-payment" ALTER COLUMN "dueDateType" TYPE "RecurringPaymentDateType_new" USING ("dueDateType"::text::"RecurringPaymentDateType_new");
ALTER TYPE "RecurringPaymentDateType" RENAME TO "RecurringPaymentDateType_old";
ALTER TYPE "RecurringPaymentDateType_new" RENAME TO "RecurringPaymentDateType";
DROP TYPE "RecurringPaymentDateType_old";
COMMIT;

-- AlterTable
ALTER TABLE "BankStatement" ADD COLUMN     "customerId" TEXT;

-- AlterTable
ALTER TABLE "recurring-payment" DROP COLUMN "fixedAmount",
DROP COLUMN "isFixedAmount";

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
