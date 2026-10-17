/*
  Warnings:

  - Added the required column `financialCategoryId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `financialCategoryId` to the `recurring-payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "financialCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recurring-payment" ADD COLUMN     "financialCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring-payment" ADD CONSTRAINT "recurring-payment_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
