/*
  Warnings:

  - Added the required column `filePath` to the `BankStatement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankStatement" ADD COLUMN     "filePath" TEXT NOT NULL;
