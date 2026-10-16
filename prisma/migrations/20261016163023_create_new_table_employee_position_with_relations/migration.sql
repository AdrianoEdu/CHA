/*
  Warnings:

  - Added the required column `employeePositionId` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeePositionEnum" AS ENUM ('TAX_DEPARTMENT_MANAGER', 'PERSONNEL_DEPARTMENT_MANAGER', 'MOTORBOY', 'TAX_ASSISTANT_N5', 'PERSONNEL_DEPARTMENT_ASSISTANT', 'TAX_ASSISTANT_N3', 'TAX_ASSISTANT_N1', 'OFFICE_ASSISTANT', 'CLEANING_ASSISTANT', 'ADMINISTRATIVE_ASSISTANT', 'TAX_ASSISTANT_N6', 'TAX_ASSISTANT_N4', 'TAX_ASSISTANT_N2');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "employeePositionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EmployeePosition" (
    "id" TEXT NOT NULL,
    "position" "EmployeePositionEnum" NOT NULL,

    CONSTRAINT "EmployeePosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_employeePositionId_fkey" FOREIGN KEY ("employeePositionId") REFERENCES "EmployeePosition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
