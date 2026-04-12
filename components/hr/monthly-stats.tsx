import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MonthlyStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [processed, pending, archived] = await Promise.all([
    prisma.travelOrderRequest.count({
      where: {
        status: { in: ['HR_PROCESSING', 'COMPLETED'] },
        hrProcessedAt: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    prisma.travelOrderRequest.count({
      where: {
        status: 'APPROVED',
        travelOrderNumber: null,
      },
    }),
    prisma.travelOrderRequest.count({
      where: {
        status: 'COMPLETED',
        hrProcessedAt: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
  ])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Processed</span>
            <span className="font-semibold text-slate-900">{processed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Pending Assignment</span>
            <span className="font-semibold text-amber-600">{pending}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Archived</span>
            <span className="font-semibold text-slate-900">{archived}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}