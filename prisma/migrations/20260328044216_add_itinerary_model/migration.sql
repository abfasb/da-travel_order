-- CreateTable
CREATE TABLE "itinerary_items" (
    "id" TEXT NOT NULL,
    "travelOrderId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itinerary_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_travelOrderId_fkey" FOREIGN KEY ("travelOrderId") REFERENCES "travel_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
