'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Smartphone } from 'lucide-react'

export function NotificationSettings({ user }: { user: any }) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [orderReadyAlerts, setOrderReadyAlerts] = useState(true)
  const [rejectionAlerts, setRejectionAlerts] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Notification preferences saved')
    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how and when you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channel Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive in-app notifications.</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          
          {/* SMS Notifications – Coming Soon */}
          <div className="flex items-center justify-between opacity-70">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label className="text-base">SMS Notifications</Label>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-600 dark:text-amber-400">
                  Soon
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Get alerts via text message.</p>
            </div>
            <Switch disabled checked={false} />
          </div>
        </div>

        {/* Alert Types */}
        <div className="space-y-4">
          <h3 className="font-medium">Alert Types</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Order Ready for Processing</Label>
              <p className="text-sm text-muted-foreground">When a travel order is fully approved.</p>
            </div>
            <Switch checked={orderReadyAlerts} onCheckedChange={setOrderReadyAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Order Rejections</Label>
              <p className="text-sm text-muted-foreground">When a travel order is rejected.</p>
            </div>
            <Switch checked={rejectionAlerts} onCheckedChange={setRejectionAlerts} />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  )
}