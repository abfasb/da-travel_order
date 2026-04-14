'use server'

import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_SIZE = 500 * 1024 

export async function uploadAvatar(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value
    if (!userId) return { success: false, error: 'Unauthorized' }

    const file = formData.get('avatar') as File
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided' }
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Only image files are allowed' }
    }

    if (file.size > MAX_SIZE) {
      return { success: false, error: 'File size must be less than 500KB' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Failed to upload image' }
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath)

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: publicUrl },
    })

    revalidatePath('/employee/profile')
    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function removeAvatar() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value
    if (!userId) return { success: false, error: 'Unauthorized' }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    //@ts-ignore
      select: { avatarUrl: true },
    })

    //@ts-ignore
    if (user?.avatarUrl) {
    //@ts-ignore
      const url = new URL(user.avatarUrl)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts.slice(pathParts.indexOf('avatars')).join('/')

      await supabase.storage.from('avatars').remove([filePath])
    }

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    })

    revalidatePath('/employee/profile')
    return { success: true }
  } catch (error) {
    console.error('Remove avatar error:', error)
    return { success: false, error: 'Failed to remove avatar' }
  }
}