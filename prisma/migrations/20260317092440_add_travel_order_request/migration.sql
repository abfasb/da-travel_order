-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "travel_orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salaryPerMonth" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "officialStation" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "destinationProvince" TEXT NOT NULL,
    "specificLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "specificPurpose" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "travelDetails" TEXT NOT NULL,
    "meansOfTransportation" TEXT NOT NULL,
    "estimatedExpenses" TEXT NOT NULL,
    "sourceOfFunds" TEXT NOT NULL,
    "accompanyingPersonnel" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "travel_orders" ADD CONSTRAINT "travel_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
