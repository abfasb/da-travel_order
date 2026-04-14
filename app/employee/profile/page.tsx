import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileView } from '@/components/employee/profile-view'

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser || sessionUser.role !== 'STAFF') redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      firstName: true,
      middleInitial: true,
      lastName: true,
      email: true,
      mobileNumber: true,
      employmentStatus: true,
      division: true,
      officialStation: true,
      role: true,
      avatarUrl: true,
    },
  })

  if (!user) redirect('/login')
 { /* @ts-ignore */}
  return <ProfileView user={user} />
}