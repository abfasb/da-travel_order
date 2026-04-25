-- AlterTable
ALTER TABLE "travel_orders" ADD COLUMN     "fundSourceId" TEXT;

-- CreateTable
CREATE TABLE "fund_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allocatedBudget" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_sources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "travel_orders" ADD CONSTRAINT "travel_orders_fundSourceId_fkey" FOREIGN KEY ("fundSourceId") REFERENCES "fund_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
