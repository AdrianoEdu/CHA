/*
  Warnings:

  - The values [IN_USE] on the enum `ReceivedCheckStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agency` on the `received_checks` table. All the data in the column will be lost.
  - You are about to drop the column `currentAmount` on the `received_checks` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `received_checks` table. All the data in the column will be lost.
  - You are about to drop the `check_usages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `received_checks` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `checkNumber` on the `received_checks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReceivedCheckStatus_new" AS ENUM ('RECEIVED', 'FINALIZED', 'CANCELLED');
ALTER TABLE "received_checks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "received_checks" ALTER COLUMN "status" TYPE "ReceivedCheckStatus_new" USING ("status"::text::"ReceivedCheckStatus_new");
ALTER TYPE "ReceivedCheckStatus" RENAME TO "ReceivedCheckStatus_old";
ALTER TYPE "ReceivedCheckStatus_new" RENAME TO "ReceivedCheckStatus";
DROP TYPE "ReceivedCheckStatus_old";
ALTER TABLE "received_checks" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;

-- DropForeignKey
ALTER TABLE "check_usages" DROP CONSTRAINT "check_usages_receivedCheckId_fkey";

-- DropForeignKey
ALTER TABLE "check_usages" DROP CONSTRAINT "check_usages_transactionId_fkey";

-- AlterTable
ALTER TABLE "received_checks" DROP COLUMN "agency",
DROP COLUMN "currentAmount",
DROP COLUMN "totalAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
DROP COLUMN "checkNumber",
ADD COLUMN     "checkNumber" INTEGER NOT NULL;

-- DropTable
DROP TABLE "check_usages";
