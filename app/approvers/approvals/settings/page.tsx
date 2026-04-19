import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { ShieldCheck } from 'lucide-react'
import { PasswordForm } from '@/components/approver/settings/password-form'

export default async function ApproverSettingsPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const userRole = cookieStore.get('user_role')?.value

  if (!userId || !userRole || !['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE'].includes(userRole)) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  })

  if (!user) redirect('/login')

  const isDefaultPassword = await bcrypt.compare('DAMIMAROPA', user.password)

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <div className="container mx-auto py-8 px-4 md:px-8 max-w-4xl">
        
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Security Settings
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your password and secure your account credentials.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-6">
            <PasswordForm isDefaultPassword={isDefaultPassword} />
          </div>
          
          <div className="hidden md:block">
            <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Password Requirements</h3>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                <li>Minimum of 8 characters long.</li>
                <li>Avoid using easily guessable words.</li>
                <li>Never share your password with anyone, including IT support.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}