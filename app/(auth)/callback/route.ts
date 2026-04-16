import { createClient } from '@/lib/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/employee/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const supabaseUser = data.user
      
      let user = await prisma.user.findUnique({
        where: { email: supabaseUser.email! },
      })

      if (!user) {
        const fullName = supabaseUser.user_metadata?.full_name || ''
        const nameParts = fullName.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        user = await prisma.user.create({
          data: {
            email: supabaseUser.email!,
            firstName,
            lastName,
            mobileNumber: '', 
            password: '',
            role: 'STAFF',
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
            employmentStatus: null,
            division: null,
            officialStation: null,
          },
        })
      } else {
        if (supabaseUser.user_metadata?.avatar_url && !user.avatarUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl: supabaseUser.user_metadata.avatar_url },
          })
        }
      }

      const cookieStore = await cookies()
      cookieStore.set('auth_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      cookieStore.set('user_role', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login page with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}