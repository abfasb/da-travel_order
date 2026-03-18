"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
      }
    });

    if (!user) {
      return { success: false, error: "User profile not found." };
    }

    await prisma.$transaction(async (tx) => {
      
      const newTravelOrder = await tx.travelOrderRequest.create({
        data: {
          userId: userId,
      //@ts-ignore
          requestorName: data.fullName,
          requestorPosition: data.position,
          requestorSalary: data.salaryPerMonth,
          requestorStation: user.officialStation, 
          employmentStatus: user.employmentStatus, 
          copiesRequired: data.copiesRequired,

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
        },
      });

      //@ts-ignore
      await tx.auditLog.create({
        data: {
          userId: userId,
          action: "CREATE_TRAVEL_ORDER",
          details: `Travel order created for destination: ${data.destinationProvince}`,
          travelOrderId: newTravelOrder.id,
        }
      });

    });

    return { success: true };
  } catch (error) {
    console.error("Travel Order Error:", error);
    return { success: false, error: "Failed to submit the travel order. Please try again." };
  }
}