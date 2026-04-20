/*
  Warnings:

  - You are about to drop the column `receivedAt` on the `received_checks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "received_checks" DROP COLUMN "receivedAt";
