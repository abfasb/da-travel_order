import { StatsCards } from '@/components/hr/stats-cards'
import { RecentOrdersTable } from '@/components/hr/recent-orders-table'
import { Button } from '@/components/ui/button'
import { Printer, FileText } from 'lucide-react'

export default function HRDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
        <p className="text-muted-foreground">Manage travel orders, assign numbers, and print documents.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Recent Orders Awaiting Number Assignment */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print Pending Orders
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Generate Monthly Report
              </Button>
            </div>
          </div>
          {/* Archive Stats */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">This Month</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Processed:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Archived:</span>
                <span className="font-medium">48</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}