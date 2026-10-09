/*
  Warnings:

  - Added the required column `agency` to the `received_checks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "received_checks" ADD COLUMN     "agency" TEXT NOT NULL;
