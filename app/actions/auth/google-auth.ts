'use server'

import { createClient } from '@/lib/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google OAuth error:', error)
    return { success: false, error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { success: true }
}