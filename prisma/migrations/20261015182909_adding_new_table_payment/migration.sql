-- AlterTable
ALTER TABLE "recurring-payment" ADD COLUMN     "fixedAmount" DECIMAL(12,2),
ADD COLUMN     "isFixedAmount" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "recurringPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recurringPaymentId_fkey" FOREIGN KEY ("recurringPaymentId") REFERENCES "recurring-payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
