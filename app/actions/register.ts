"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(2),
  middleInitial: z.string().max(2).optional(),
  lastName: z.string().min(2),
  email: z.string().email(),
  mobileNumber: z.string().min(10),
  employmentStatus: z.string().min(1),
  division: z.string().min(1),
  officialStation: z.string().min(1), 
  password: z.string().min(8),
});

export async function registerUser(data: any) {
  try {
    const parsedData = formSchema.safeParse(data);
    if (!parsedData.success) return { success: false, error: "Invalid data." };

    const { password, employmentStatus, ...rest } = parsedData.data;

    const statusMap: Record<string, "PERMANENT" | "COS" | "JO"> = {
      "Permanent": "PERMANENT",
      "Contract of Service (COS)": "COS",
      "Job Order (JO)": "JO",
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        ...rest,
        //@ts-ignore
        middleInitial: rest.middleInitial || null,
        employmentStatus: statusMap[employmentStatus] || "JO",
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: "Email already exists." };
    return { success: false, error: "Registration failed." };
  }
}