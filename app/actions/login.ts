"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function loginUser(data: any) {
  try {
    const parsedData = loginSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, error: "Invalid email or password." };
    }

    const { email, password } = parsedData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { success: false, error: "Invalid email or password." };
    }

    const cookieStore = await cookies();
    
    cookieStore.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    cookieStore.set("user_role", user.role, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    return { 
      success: true, 
      user: { id: user.id, role: user.role, name: user.firstName } 
    };

  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}