import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const division = req.nextUrl.searchParams.get('division');
  if (!division) return NextResponse.json({ error: 'Missing division' }, { status: 400 });

  const result = await prisma.user.findMany({
    where: { division, role: 'STAFF' },
    select: {
      firstName: true,
      lastName: true,
      _count: { select: { travelOrders: true } },
    },
    orderBy: { travelOrders: { _count: 'desc' } },
    take: 10, 
  });

  const data = result.map(user => ({
    name: `${user.firstName} ${user.lastName}`,
    count: user._count.travelOrders,
  }));

  return NextResponse.json(data);
}