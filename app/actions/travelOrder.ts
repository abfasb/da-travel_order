"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitTravelOrder(data: any) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        officialStation: true,
        employmentStatus: true,
        division: true,
      }
    });

    if (!user) {
      return { success: false, error: "User profile not found." };
    }

    await prisma.$transaction(async (tx) => {
      const newTravelOrder = await tx.travelOrderRequest.create({
        data: {
          userId: userId,
          requestorName: data.fullName,
          requestorPosition: data.position,
          requestorSalary: data.salaryPerMonth,
          requestorStation: user.officialStation || "N/A",
          employmentStatus: user.employmentStatus || "PERMANENT",

          departureDate: new Date(data.departureDate),
          returnDate: new Date(data.returnDate),

          destinationProvince: data.destinationProvince,
          specificLocation: data.specificLocation,
          destinationSummary: data.destinationSummary,

          purpose: data.specificPurpose,
          objectives: data.objectives,
          travelDetails: data.travelDetails,

          meansOfTransport: data.meansOfTransport,
          estimatedExpenses: data.estimatedExpenses,
          sourceOfFunds: data.sourceOfFunds,
          accompanyingPersonnel: data.accompanyingPersonnel || null,

          status: "PENDING",

          ...(user.employmentStatus !== "PERMANENT" && data.itineraryItems && data.itineraryItems.length > 0
            ? {
                itineraryItems: {
                  create: data.itineraryItems.map((item: any) => ({
                    date: new Date(item.date),
                    location: item.location,
                    activity: item.activity,
                    responsiblePerson: item.responsiblePerson,
                  })),
                },
              }
            : {}),
        },
      });

      // Determine if user belongs to Field Operations Division (case‑insensitive)
      const isFieldOps = user.division?.toLowerCase().includes('field') ?? false;
      const roles = isFieldOps
        ? ["APCO", "CHIEF_AGRICULTURIST", "CHIEF_ADMINISTRATIVE", "REGIONAL_EXECUTIVE"]
        : ["CHIEF_ADMINISTRATIVE", "REGIONAL_EXECUTIVE"];

      for (const role of roles) {
        await tx.approval.create({
          data: {
            travelOrderId: newTravelOrder.id,
            // @ts-ignore
            approverRole: role,
            status: "PENDING",
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: userId,
          action: "CREATE_TRAVEL_ORDER",
          details: `Travel order created for destination: ${data.destinationProvince}`,
          travelOrderId: newTravelOrder.id,
        },
      });
    });

    revalidatePath("/approvals");
    revalidatePath("/employee/history");

    return { success: true };
  } catch (error) {
    console.error("Travel Order Error:", error);
    return { success: false, error: "Failed to submit the travel order. Please try again." };
  }
}