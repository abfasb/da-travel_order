'use server'

import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value
    if (!userId) return { success: false, error: 'Unauthorized' }

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
    console.error('Change password error:', error)
    return { success: false, error: 'Failed to change password' }
  }
}