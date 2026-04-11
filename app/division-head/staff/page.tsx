import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default async function StaffPage() {
  const user = await getCurrentUser();
  if (!user?.division) return null;

  const staff = await prisma.user.findMany({
    where: {
      division: user.division,
      role: 'STAFF',
    },
    include: {
      _count: {
        select: { travelOrders: true },
      },
    },
    orderBy: { lastName: 'asc' },
  });

  const staffWithStats = await Promise.all(
    staff.map(async (s) => {
      const pendingCount = await prisma.travelOrderRequest.count({
        where: {
          userId: s.id,
          status: { in: ['PENDING', 'REVIEWING'] },
        },
      });
      const approvedCount = await prisma.travelOrderRequest.count({
        where: {
          userId: s.id,
          status: 'APPROVED',
        },
      });
      return { ...s, pendingCount, approvedCount };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Members</h1>
        <p className="text-slate-500">Manage and view staff travel history.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Staff ({staffWithStats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employment Status</TableHead>
                <TableHead>Official Station</TableHead>
                <TableHead>Travel Orders</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffWithStats.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.firstName} {s.lastName}
                  </TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.employmentStatus || '—'}</Badge>
                  </TableCell>
                  <TableCell>{s.officialStation || '—'}</TableCell>
                  <TableCell>{s._count.travelOrders}</TableCell>
                  <TableCell>
                    {s.pendingCount > 0 ? (
                      <Badge variant="secondary">{s.pendingCount}</Badge>
                    ) : (
                      '0'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/division-head/staff/${s.id}`}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}