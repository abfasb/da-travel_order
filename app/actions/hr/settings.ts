'use server'

import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function updateProfile(userId: string, data: {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
}) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
      },
    })
    revalidatePath('/hr/settings')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Email may already be in use.' }
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: 'User not found' }

    const isValid = await compare(currentPassword, user.password)
    if (!isValid) return { success: false, error: 'Current password is incorrect' }

    const hashedPassword = await hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to change password' }
  }
}