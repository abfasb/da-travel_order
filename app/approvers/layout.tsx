import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/approver/navbar'

export default async function ApproverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  let user = null

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        role: true,
        email: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar user={user} />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}