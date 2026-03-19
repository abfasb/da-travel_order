import { OrdersTable } from '@/components/hr/orders-table'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Travel Orders</h1>
        <p className="text-muted-foreground">View, filter, and manage all travel requests.</p>
      </div>
      <OrdersTable />
    </div>
  )
}