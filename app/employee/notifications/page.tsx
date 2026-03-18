import { NotificationsList } from '@/components/employee/notifications-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCheck } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <Button variant="outline" size="sm">
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      <Card>
        <NotificationsList />
      </Card>
    </div>
  )
}