'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { Role, EmploymentStatus } from '@prisma/client'

type CreateUserInput = {
  firstName: string
  lastName: string
  middleInitial?: string
  email: string
  mobileNumber: string
  role: Role
  password: string
  employmentStatus?: EmploymentStatus
  division?: string
  province?: string
  officialStation?: string
}

export async function createUser(data: CreateUserInput) {
  try {
    const hashedPassword = await hash(data.password, 10)

    //@ts-ignore
    const requiresFullProfile = data.role === 'STAFF' || data.role === 'DIVISION_HEAD'

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        password: hashedPassword,
        employmentStatus: requiresFullProfile ? data.employmentStatus : null,
        division: requiresFullProfile ? data.division : null,
        province: requiresFullProfile ? data.province : null,
        officialStation: requiresFullProfile ? data.officialStation : null,
      },
    })

    revalidatePath('/hr/users')
    return { success: true }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user. Email may already exist.' }
  }
}