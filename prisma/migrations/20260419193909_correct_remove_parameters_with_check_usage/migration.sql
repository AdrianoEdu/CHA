/*
  Warnings:

  - You are about to drop the column `referenceId` on the `check_usages` table. All the data in the column will be lost.
  - You are about to drop the column `referenceTable` on the `check_usages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "check_usages" DROP COLUMN "referenceId",
DROP COLUMN "referenceTable";
