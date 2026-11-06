-- AlterTable
ALTER TABLE "employee-vacation" ADD COLUMN     "remainingDays" INTEGER DEFAULT 30,
ALTER COLUMN "periods" DROP NOT NULL;
