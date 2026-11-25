-- AlterTable
ALTER TABLE "received_checks" ADD COLUMN     "paymentId" TEXT;

-- AddForeignKey
ALTER TABLE "received_checks" ADD CONSTRAINT "received_checks_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
