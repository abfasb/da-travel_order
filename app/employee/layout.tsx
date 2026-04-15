import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/employee/sidebar'
import { Navbar } from '@/components/employee/navbar'

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  const role = cookieStore.get('user_role')?.value

  if (!userId || role !== 'STAFF') {
    redirect('/login')
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      division: true, 
      avatarUrl: true,
    }
  })

  if (!currentUser) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-muted/10">
        {/* @ts-ignore */}
      <Sidebar user={currentUser} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* @ts-ignore */}
        <Navbar user={currentUser} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100/50">
          {children}
        </main>
      </div>
    </div>
  )
}