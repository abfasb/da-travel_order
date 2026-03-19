import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileView } from '@/components/employee/profile-view'

export default async function EmployeeProfilePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your personal and employment information.
        </p>
      </div>

      <ProfileView user={user} />
    </div>
  )
}