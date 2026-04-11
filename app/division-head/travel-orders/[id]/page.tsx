import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function TravelOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user?.division) return null;

  const { id } = await params;

  const order = await prisma.travelOrderRequest.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, division: true, employmentStatus: true } },
      approvals: { include: { approver: { select: { firstName: true, lastName: true } } } },
      itineraryItems: true,
      attachments: true,
    },
  });

  if (!order || order.user.division !== user.division) {
    notFound();
  }

  const statusVariant: any = {
    PENDING: 'secondary',
    REVIEWING: 'outline',
    APPROVED: 'default',
    REJECTED: 'destructive',
    COMPLETED: 'success',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Travel Order Details</h1>
          <p className="text-slate-500">
            {order.travelOrderNumber || 'Draft'} • Created{' '}
            {format(new Date(order.createdAt), 'PPP')}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] || 'secondary'} className="text-sm px-3 py-1">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Employee</p>
                  <p className="text-base">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Employment Status</p>
                  <p className="text-base">{order.employmentStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Purpose</p>
                  <p className="text-base">{order.purpose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Destination</p>
                  <p className="text-base">
                    {order.destinationProvince} - {order.specificLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Departure</p>
                  <p className="text-base">{format(new Date(order.departureDate), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Return</p>
                  <p className="text-base">{format(new Date(order.returnDate), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Transportation</p>
                  <p className="text-base">{order.meansOfTransport}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Estimated Expenses</p>
                  <p className="text-base">{order.estimatedExpenses}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Objectives</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{order.objectives}</p>
              </div>
            </CardContent>
          </Card>

          {order.itineraryItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.itineraryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.activity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.approvals.map((approval) => (
                  <div key={approval.id} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-full ${
                        approval.status === 'APPROVED'
                          ? 'bg-emerald-500'
                          : approval.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{approval.approverRole}</p>
                      {approval.approver && (
                        <p className="text-xs text-slate-500">
                          {approval.approver.firstName} {approval.approver.lastName}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {approval.status}
                      </Badge>
                      {approval.comment && (
                        <p className="text-xs text-slate-600 mt-1">{approval.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {order.rejectionReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Rejection Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">{order.rejectionReason}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}