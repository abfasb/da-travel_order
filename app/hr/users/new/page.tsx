import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AddUserForm from '@/components/hr/add-user-form'

export default async function NewUserPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (!role || role !== 'HR') {
    redirect('/login')
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        <p className="text-muted-foreground">Create a new user account and assign a role.</p>
      </div>

      <AddUserForm />
    </div>
  )
}