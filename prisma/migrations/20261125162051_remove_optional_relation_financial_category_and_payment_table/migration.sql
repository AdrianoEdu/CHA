/*
  Warnings:

  - Made the column `financialCategoryId` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_financialCategoryId_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "financialCategoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
