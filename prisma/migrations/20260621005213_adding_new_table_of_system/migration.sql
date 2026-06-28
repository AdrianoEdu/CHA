-- CreateTable
CREATE TABLE "CurrentAccount" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "CurrentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankStatement" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currentAccountId" TEXT NOT NULL,
    "financialCategoryId" TEXT NOT NULL,

    CONSTRAINT "BankStatement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CurrentAccount" ADD CONSTRAINT "CurrentAccount_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_currentAccountId_fkey" FOREIGN KEY ("currentAccountId") REFERENCES "CurrentAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_financialCategoryId_fkey" FOREIGN KEY ("financialCategoryId") REFERENCES "financial_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
