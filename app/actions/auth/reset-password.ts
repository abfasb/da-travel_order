'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function resetPassword(token: string, newPassword: string) {
  try {
    //@ts-ignore
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken) {
      return { success: false, error: 'Invalid or expired token' }
    }

    if (resetToken.expiresAt < new Date()) {
    //@ts-ignore
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
      return { success: false, error: 'Token has expired' }
    }

    const hashedPassword = await hash(newPassword, 10)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
        //@ts-ignore
      prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error: 'Failed to reset password' }
  }
}