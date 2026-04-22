import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelOrdersTable } from '@/components/division-head/travel-orders-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();
  const { id } = await params;

  const staff = await prisma.user.findUnique({
    where: { id, division: currentUser?.division, role: 'STAFF' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      employmentStatus: true,
      officialStation: true,
      avatarUrl: true,
      travelOrders: {
        include: {
          approvals: true,
          user: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!staff) notFound();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/division-head/staff">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff List
          </Link>
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={staff.avatarUrl || undefined} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xl">
            {staff.firstName[0]}{staff.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {staff.firstName} {staff.lastName}
          </h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{staff.employmentStatus}</Badge>
            <Badge variant="secondary">{staff.officialStation}</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel History ({staff.travelOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TravelOrdersTable orders={staff.travelOrders as any} />
        </CardContent>
      </Card>
    </div>
  );
}