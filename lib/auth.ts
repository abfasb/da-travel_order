import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_session')?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      division: true,
      officialStation: true,
      employmentStatus: true,
    },
  });

  return user;
});