'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function createUser(data: {
  firstName: string
  lastName: string
  middleInitial?: string
  email: string
  mobileNumber: string
  role: 'APCO' | 'CHIEF_AGRICULTURIST' | 'CHIEF_ADMINISTRATIVE' | 'REGIONAL_EXECUTIVE'
  password: string
}) {
  try {
    const hashedPassword = await hash(data.password, 10)

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial,
        email: data.email,
        mobileNumber: data.mobileNumber,
        //@ts-ignore
        employmentStatus: null,   // optional now
        //@ts-ignore
        division: null,           // optional now
        //@ts-ignore
        officialStation: null,    // optional now
        role: data.role,
        password: hashedPassword,
      },
    })

    revalidatePath('/hr/users')
    return { success: true }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user. Email may already exist.' }
  }
}