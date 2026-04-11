import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const division = req.nextUrl.searchParams.get('division');
  if (!division) return NextResponse.json({ error: 'Missing division' }, { status: 400 });

  const result = await prisma.travelOrderRequest.groupBy({
    by: ['destinationProvince'],
    where: { user: { division } },
    _count: { destinationProvince: true },
    orderBy: { _count: { destinationProvince: 'desc' } },
  });

  const data = result.map(item => ({
    name: item.destinationProvince,
    value: item._count.destinationProvince,
  }));

  return NextResponse.json(data);
}