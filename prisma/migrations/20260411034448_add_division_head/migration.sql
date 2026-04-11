-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DIVISION_HEAD';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "savedSignature" TEXT;
