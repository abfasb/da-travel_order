import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const division = req.nextUrl.searchParams.get('division');
  if (!division) return NextResponse.json({ error: 'Missing division' }, { status: 400 });

  const currentYear = new Date().getFullYear();
  const monthlyData = await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM "createdAt") as month_num,
      TO_CHAR("createdAt", 'Mon') as month,
      COUNT(*)::int as count
    FROM "travel_orders"
    WHERE "userId" IN (SELECT id FROM "users" WHERE division = ${division})
      AND EXTRACT(YEAR FROM "createdAt") = ${currentYear}
    GROUP BY month_num, month
    ORDER BY month_num
  `;

  return NextResponse.json(monthlyData);
}