import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TravelOrdersTable } from '@/components/division-head/travel-orders-table';
import { TravelOrderFilters } from '@/components/division-head/travel-order-filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchParams {
  status?: string;
  employee?: string;
  month?: string;
  year?: string;
}

export default async function TravelOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getCurrentUser();
  if (!user?.division) return null;

  const params = await searchParams;
  const division = user.division;

  // Build where clause
  const where: any = { user: { division } };
  if (params.status) where.status = params.status;
  if (params.employee) {
    where.user = {
      ...where.user,
      OR: [
        { firstName: { contains: params.employee, mode: 'insensitive' } },
        { lastName: { contains: params.employee, mode: 'insensitive' } },
      ],
    };
  }

  // Date filters
  if (params.month && params.year) {
    const month = parseInt(params.month) - 1;
    const year = parseInt(params.year);
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    where.createdAt = { gte: startDate, lte: endDate };
  }

  const orders = await prisma.travelOrderRequest.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, division: true } },
      approvals: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const employees = await prisma.user.findMany({
    where: { division, role: 'STAFF' },
    select: { firstName: true, lastName: true, id: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Travel Orders</h1>
        <p className="text-slate-500 dark:text-white">Monitor and review travel requests from your division.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <TravelOrderFilters employees={employees} />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Results ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TravelOrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}