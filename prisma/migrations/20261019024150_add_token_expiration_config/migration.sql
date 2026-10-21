-- CreateEnum
CREATE TYPE "TokenExpirationUnit" AS ENUM ('MINUTES', 'HOURS', 'DAYS');

-- AlterTable
ALTER TABLE "system_configs" ADD COLUMN     "tokenExpirationUnit" "TokenExpirationUnit" NOT NULL DEFAULT 'HOURS',
ADD COLUMN     "tokenExpirationValue" INTEGER NOT NULL DEFAULT 2;
