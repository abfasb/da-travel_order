import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UsersTable } from '@/components/hr/users-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function UsersPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (!role || role !== 'HR') {
    redirect('/login')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            View and manage all system users, including approvers.
          </p>
        </div>
        <Button asChild>
          <Link href="/hr/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </Button>
      </div>

      <UsersTable users={users} />
    </div>
  )
}