import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function OrderSummary({ order }: { order: any }) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-semibold text-lg">{order?.purpose}</h3>
          <p className="text-sm text-muted-foreground">{order?.destinationProvince}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Employee:</span>{' '}
            {/* Fallback to user relations if requestorName isn't set, but it should be based on schema */}
            <span className="font-medium">
              {order?.requestorName || `${order?.user?.firstName} ${order?.user?.lastName}`}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Position:</span>{' '}
            {/* FIXED: Pulled directly from order, not order.user */}
            <span className="font-medium">{order?.requestorPosition}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Division:</span>{' '}
            <span className="font-medium">{order?.user?.division || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Station:</span>{' '}
            {/* FIXED: Pulled from order.requestorStation first */}
            <span className="font-medium">
              {order?.requestorStation || order?.user?.officialStation || 'N/A'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Departure:</span>{' '}
            <span className="font-medium">
              {order?.departureDate ? format(new Date(order.departureDate), 'PPP') : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Return:</span>{' '}
            <span className="font-medium">
              {order?.returnDate ? format(new Date(order.returnDate), 'PPP') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Specific Location:</span>{' '}
          <span className="font-medium">{order?.specificLocation}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Objectives:</span>{' '}
          <span className="font-medium">{order?.objectives}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Means of Transport:</span>{' '}
          <span className="font-medium">{order?.meansOfTransport}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Estimated Expenses:</span>{' '}
          <span className="font-medium">{order?.estimatedExpenses}</span>
        </div>

        {order?.accompanyingPersonnel && (
          <div className="text-sm">
            <span className="text-muted-foreground">Accompanying:</span>{' '}
            <span className="font-medium">{order.accompanyingPersonnel}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {order?.approvals?.map((approval: any) => (
            <Badge
              key={approval.id}
              variant="outline"
              className={
                approval.status === 'APPROVED'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : approval.status === 'REJECTED'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-yellow-200 bg-yellow-50 text-yellow-700'
              }
            >
              {approval.approverRole.replace('_', ' ')}: {approval.status}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}