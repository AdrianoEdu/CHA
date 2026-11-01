/*
  Warnings:

  - Added the required column `salary` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "salary" DECIMAL(12,2) NOT NULL;

-- CreateTable
CREATE TABLE "employee-vacation" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "acquisitionStart" DATE NOT NULL,
    "acquisitionEnd" DATE NOT NULL,
    "periods" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee-vacation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee-vacation_employeeId_idx" ON "employee-vacation"("employeeId");

-- AddForeignKey
ALTER TABLE "employee-vacation" ADD CONSTRAINT "employee-vacation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
