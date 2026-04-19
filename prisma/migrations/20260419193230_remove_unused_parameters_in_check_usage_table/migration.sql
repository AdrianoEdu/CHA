/*
  Warnings:

  - Added the required column `updatedAt` to the `check_usages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_usages" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
