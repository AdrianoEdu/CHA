/*
  Warnings:

  - You are about to drop the column `type` on the `customers` table. All the data in the column will be lost.
  - Added the required column `customerType` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "type",
ADD COLUMN     "customerType" "CustomerType" NOT NULL;
