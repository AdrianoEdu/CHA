/*
  Warnings:

  - A unique constraint covering the columns `[numberId]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numberId` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "numberId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_numberId_key" ON "customers"("numberId");
