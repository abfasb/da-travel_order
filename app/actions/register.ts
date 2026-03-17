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
  officialStation: z.string().min(2),
  password: z.string().min(8),
});

export async function registerUser(data: any) {
  try {
    const parsedData = formSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { success: false, error: "Invalid data submitted." };
    }

    const validData = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: validData.email },
    });

    if (existingUser) {
      return { success: false, error: "This email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(validData.password, 10);

    let statusEnum = "JO";
    if (validData.employmentStatus === "Permanent") statusEnum = "PERMANENT";
    if (validData.employmentStatus === "Contract of Service (COS)") statusEnum = "COS";

    await prisma.user.create({
      data: {
        //@ts-ignore
        firstName: validData.firstName,
        middleInitial: validData.middleInitial || null,
        lastName: validData.lastName,
        email: validData.email,
        mobileNumber: validData.mobileNumber,
        employmentStatus: statusEnum as any,
        division: validData.division,
        officialStation: validData.officialStation,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}