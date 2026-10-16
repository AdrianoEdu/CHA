/*
  Warnings:

  - Added the required column `dueDay` to the `recurring-payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recurring-payment" ADD COLUMN     "dueDay" INTEGER NOT NULL;
