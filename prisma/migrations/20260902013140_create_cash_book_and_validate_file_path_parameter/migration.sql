-- AlterTable
ALTER TABLE "BankStatement" ALTER COLUMN "filePath" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CashBook" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filePath" TEXT,
    "currentAccountId" TEXT NOT NULL,
    "financialCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashBook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_currentAccountId_fkey" FOREIGN KEY ("currentAccountId") REFERENCES "CurrentAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBook" ADD CONSTRAINT "CashBook_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
