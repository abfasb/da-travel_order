'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function updatePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New passwords do not match.' }
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' }
  }

  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return { success: false, error: 'User not found.' }
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    return { success: false, error: 'Current password is incorrect.' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  revalidatePath('/settings')
  return { success: true }
}