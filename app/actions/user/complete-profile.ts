'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function completeProfile(
  userId: string,
  data: {
    mobileNumber: string
    division: string
    province: string
    officialStation: string
    employmentStatus: 'PERMANENT' | 'COS' | 'JO'
  }
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        mobileNumber: data.mobileNumber,
        division: data.division,
        officialStation: data.officialStation,
        employmentStatus: data.employmentStatus,
      },
    })

    revalidatePath('/employee/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Profile completion error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}