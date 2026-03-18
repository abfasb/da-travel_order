/*
  Warnings:

  - You are about to drop the column `destination` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `meansOfTransportation` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `officialStation` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `salaryPerMonth` on the `travel_orders` table. All the data in the column will be lost.
  - You are about to drop the column `specificPurpose` on the `travel_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[travelOrderNumber]` on the table `travel_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `copiesRequired` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationSummary` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentStatus` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meansOfTransport` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestorName` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestorPosition` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestorSalary` to the `travel_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestorStation` to the `travel_orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'CHECKING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RequestStatus" ADD VALUE 'HR_PROCESSING';
ALTER TYPE "RequestStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "travel_orders" DROP COLUMN "destination",
DROP COLUMN "meansOfTransportation",
DROP COLUMN "name",
DROP COLUMN "officialStation",
DROP COLUMN "position",
DROP COLUMN "salaryPerMonth",
DROP COLUMN "specificPurpose",
ADD COLUMN     "copiesRequired" INTEGER NOT NULL,
ADD COLUMN     "destinationSummary" TEXT NOT NULL,
ADD COLUMN     "employmentStatus" "EmploymentStatus" NOT NULL,
ADD COLUMN     "hrProcessedAt" TIMESTAMP(3),
ADD COLUMN     "hrUserId" TEXT,
ADD COLUMN     "meansOfTransport" TEXT NOT NULL,
ADD COLUMN     "purpose" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "requestorName" TEXT NOT NULL,
ADD COLUMN     "requestorPosition" TEXT NOT NULL,
ADD COLUMN     "requestorSalary" TEXT NOT NULL,
ADD COLUMN     "requestorStation" TEXT NOT NULL,
ADD COLUMN     "travelOrderNumber" TEXT;

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "travelOrderId" TEXT NOT NULL,
    "approverRole" "Role" NOT NULL,
    "approverId" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "signatureData" TEXT,
    "certificationCheck" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "travelOrderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "travelOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "travelOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "approvals_travelOrderId_approverRole_key" ON "approvals"("travelOrderId", "approverRole");

-- CreateIndex
CREATE UNIQUE INDEX "travel_orders_travelOrderNumber_key" ON "travel_orders"("travelOrderNumber");

-- AddForeignKey
ALTER TABLE "travel_orders" ADD CONSTRAINT "travel_orders_hrUserId_fkey" FOREIGN KEY ("hrUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_travelOrderId_fkey" FOREIGN KEY ("travelOrderId") REFERENCES "travel_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_travelOrderId_fkey" FOREIGN KEY ("travelOrderId") REFERENCES "travel_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_travelOrderId_fkey" FOREIGN KEY ("travelOrderId") REFERENCES "travel_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_travelOrderId_fkey" FOREIGN KEY ("travelOrderId") REFERENCES "travel_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
