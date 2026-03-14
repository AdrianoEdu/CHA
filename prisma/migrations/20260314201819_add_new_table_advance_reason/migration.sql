/*
  Warnings:

  - Added the required column `reasonId` to the `employee_advances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee_advances" ADD COLUMN     "reasonId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "advance_reasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advance_reasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employee_advances" ADD CONSTRAINT "employee_advances_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "advance_reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
