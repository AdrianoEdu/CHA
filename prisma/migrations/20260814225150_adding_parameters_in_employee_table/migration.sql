/*
  Warnings:

  - Added the required column `dateOfBirth` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "document" TEXT NOT NULL;
