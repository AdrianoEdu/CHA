/*
  Warnings:

  - You are about to drop the column `salary` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `referenceMonth` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `recurring-payment` table. All the data in the column will be lost.
  - You are about to drop the column `financialCategoryId` on the `recurring-payment` table. All the data in the column will be lost.
  - You are about to drop the column `isMonthly` on the `recurring-payment` table. All the data in the column will be lost.
  - Added the required column `dueDateType` to the `recurring-payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecurringPaymentDateType" AS ENUM ('FIXED_DAY', 'FIFTH_BUSINESS_DAY', 'EMPLOYEE_SALARY');

-- CreateEnum
CREATE TYPE "BusinessDayAdjustment" AS ENUM ('PREVIOUS', 'NEXT');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_financialCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "recurring-payment" DROP CONSTRAINT "recurring-payment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "recurring-payment" DROP CONSTRAINT "recurring-payment_financialCategoryId_fkey";

-- DropIndex
DROP INDEX "payments_recurringPaymentId_referenceMonth_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "salary";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "customerId",
DROP COLUMN "referenceMonth",
ALTER COLUMN "financialCategoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recurring-payment" DROP COLUMN "customerId",
DROP COLUMN "financialCategoryId",
DROP COLUMN "isMonthly",
ADD COLUMN     "adjustment" "BusinessDayAdjustment",
ADD COLUMN     "dueDateType" "RecurringPaymentDateType" NOT NULL,
ALTER COLUMN "dueDay" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
