import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileSettings } from '@/components/hr/settings/profile-settings'
import { NotificationSettings } from '@/components/hr/settings/notification-settings'
import { SystemSettings } from '@/components/hr/settings/system-settings'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage your account and system preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
            { /* @ts-ignore */ }
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings user={user} />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}