import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileContent } from '@/components/division-head/profile-content'

export default async function DivisionHeadProfilePage() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser || sessionUser.role !== 'DIVISION_HEAD') redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      firstName: true,
      middleInitial: true,
      lastName: true,
      email: true,
      mobileNumber: true,
      division: true,
      officialStation: true,
      employmentStatus: true,
      avatarUrl: true,
    },
  })

  if (!user) redirect('/login')

  return <ProfileContent user={user} />
}