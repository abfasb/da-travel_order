'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function saveSignature(signatureData: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { savedSignature: signatureData },
  })

  revalidatePath('/approvers/approvals')
  return { success: true }
}

export async function getSavedSignature() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    //@ts-ignore
    select: { savedSignature: true },
  })
    //@ts-ignore
  return user?.savedSignature || null
}