'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { Role } from '@prisma/client'

type CreateUserInput = {
  firstName: string
  lastName: string
  middleInitial?: string
  email: string
  mobileNumber: string
  role: Role
  password: string
  division?: string  // only for DIVISION_HEAD
}

export async function createUser(data: CreateUserInput) {
  try {
    const hashedPassword = await hash(data.password, 10)

    // @ts-ignore
    const division = data.role === 'DIVISION_HEAD' ? data.division : null

    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleInitial: data.middleInitial,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        password: hashedPassword,
        division: division,
      },
    })

    revalidatePath('/hr/users')
    return { success: true }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user. Email may already exist.' }
  }
}