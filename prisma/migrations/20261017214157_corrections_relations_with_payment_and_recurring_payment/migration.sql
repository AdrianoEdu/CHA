-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "employeeId" TEXT;

-- AlterTable
ALTER TABLE "recurring-payment" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "employeeId" TEXT;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring-payment" ADD CONSTRAINT "recurring-payment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring-payment" ADD CONSTRAINT "recurring-payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
