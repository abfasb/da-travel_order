import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import TravelOrderDocument from '@/app/sample/page';
import ProposedItineraryDocument from '@/app/sample/itinerary/page';
import CertificationDocument from '@/app/sample/certification/page';
import Link from 'next/link';
import { PDFDownloadButton } from '@/components/division-head/pdf-download-button';

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
      user: {
        select: {
          firstName: true,
          lastName: true,
          division: true,
          employmentStatus: true,
          officialStation: true,
        },
      },
      approvals: {
        include: {
          approver: { select: { firstName: true, lastName: true } },
        },
      },
      itineraryItems: true,
      attachments: true,
    },
  });

  if (!order || order.user.division !== user.division) {
    notFound();
  }

  const isPermanent = order.employmentStatus === 'PERMANENT';
  const isCOSorJO = order.employmentStatus === 'COS' || order.employmentStatus === 'JO';

  const statusVariant: any = {
    PENDING: 'secondary',
    REVIEWING: 'outline',
    APPROVED: 'default',
    REJECTED: 'destructive',
    COMPLETED: 'success',
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/division-head/travel-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Travel Orders
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Travel Order Details</h1>
          <p className="text-muted-foreground">
            {order.travelOrderNumber || 'Draft'} • Created{' '}
            {format(new Date(order.createdAt), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusVariant[order.status] || 'secondary'} className="text-sm px-3 py-1">
            {order.status}
          </Badge>
          {order.status === 'COMPLETED' && (
            <>
             <Button variant="outline" size="sm" asChild>
              <Link href={`/division-head/travel-orders/${order.id}/print`} target="_blank">
                <Printer className="mr-2 h-4 w-4" />
                Print All
              </Link>
             </Button>
             <PDFDownloadButton order={order} />
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Travel Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="approvals">Approval Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Employee</p>
                      <p className="text-base text-foreground">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Employment Status</p>
                      <Badge variant="outline">{order.employmentStatus}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p className="text-base text-foreground">{order.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destination</p>
                      <p className="text-base text-foreground">
                        {order.destinationProvince} - {order.specificLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Departure</p>
                      <p className="text-base text-foreground">{format(new Date(order.departureDate), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Return</p>
                      <p className="text-base text-foreground">{format(new Date(order.returnDate), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transportation</p>
                      <p className="text-base text-foreground">{order.meansOfTransport}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Expenses</p>
                      <p className="text-base text-foreground">{order.estimatedExpenses}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Objectives</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{order.objectives}</p>
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
                            <TableCell className="text-foreground">{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-foreground">{item.location}</TableCell>
                            <TableCell className="text-foreground">{item.activity}</TableCell>
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
                  <CardTitle>Approval Progress</CardTitle>
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
                              : 'bg-muted-foreground'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{approval.approverRole}</p>
                          {approval.approver && (
                            <p className="text-xs text-muted-foreground">
                              {approval.approver.firstName} {approval.approver.lastName}
                            </p>
                          )}
                          <Badge variant="outline" className="mt-1">
                            {approval.status}
                          </Badge>
                          {approval.comment && (
                            <p className="text-xs text-muted-foreground mt-1">{approval.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {order.rejectionReason && (
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="text-red-800 dark:text-red-300">Rejection Reason</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-700 dark:text-red-400">{order.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Official Travel Order Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {order.status !== 'COMPLETED' ? (
                <div className="text-center py-8 text-muted-foreground">
                  Documents will be available after HR completes processing.
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Employment Status: <Badge>{order.employmentStatus}</Badge> — 
                    {isPermanent ? ' For Permanent you only need Travel Order Document' : ' For JO and COS you will have 3 documents: Travel Order, Itinerary, and Certification'}.
                  </p>
                  
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-semibold mb-2 text-foreground">Travel Order {isPermanent && '(4 copies)'}</h3>
                    <div className="max-h-[1300px] overflow-hidden border bg-background p-2">
                      <TravelOrderDocument data={order} />
                    </div>
                  </div>

                  {isCOSorJO && (
                    <>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-semibold mb-2 text-foreground">Proposed Itinerary</h3>
                        <div className="max-h-[1300px] overflow-hidden border bg-background p-2">
                          <ProposedItineraryDocument data={order} />
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-semibold mb-2 text-foreground">Certification</h3>
                        <div className="max-h-[1300px] overflow-hidden border bg-background p-2">
                          <CertificationDocument data={order} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Comment (For Rejected TO ONLY)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="text-foreground">{approval.approverRole}</TableCell>
                      <TableCell>
                        <Badge variant={approval.status === 'APPROVED' ? 'default' : 'secondary'}>
                          {approval.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {approval.updatedAt ? format(new Date(approval.updatedAt), 'PPp') : '—'}
                      </TableCell>
                      <TableCell className="text-foreground">{approval.comment || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}