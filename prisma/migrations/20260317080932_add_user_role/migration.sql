-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STAFF', 'APCO', 'HR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STAFF';
