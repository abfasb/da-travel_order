import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export async function RecentRequestsTable() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) return null;

  const recentRequests = await prisma.travelOrderRequest.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" }, 
    take: 5,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': 
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>
      case 'PENDING': 
        return <Badge variant="outline" className="text-amber-600 border-amber-500 bg-amber-50">Pending</Badge>
      case 'REJECTED': 
        return <Badge variant="destructive">Rejected</Badge>
      case 'REVIEWING': 
        return <Badge className="bg-blue-500 hover:bg-blue-600">Reviewing</Badge>
      case 'HR_PROCESSING': 
        return <Badge className="bg-purple-500 hover:bg-purple-600">HR Processing</Badge>
      default: 
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
        <h3 className="font-semibold leading-none tracking-tight text-lg">Recent Travel Requests</h3>
        <p className="text-sm text-muted-foreground pt-1">Your most recently submitted itineraries.</p>
      </div>
      
      <div className="p-0 flex-1 overflow-auto">
        {recentRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <p className="text-sm text-muted-foreground">No travel requests found.</p>
            <p className="text-xs text-muted-foreground mt-1">Submit a new request to see it here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6">Destination</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Date Filed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium pl-6">{req.destinationProvince}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {/* Format dates into readable strings */}
                    {new Date(req.departureDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(req.returnDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm pr-6">
                    {new Date(req.createdAt).toLocaleDateString('en-PH')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}