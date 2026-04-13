import { Sidebar } from "@/components/hr/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/hr/navbar"
import { prisma } from "@/lib/prisma"

export default async function HRLayout({ children }: { children: React.ReactNode }) {

   const user = await getCurrentUser()
  
  let notificationCount = 0
  if (user) {
    notificationCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    })
  }

  return (
    <div className="flex h-screen bg-muted/10">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar user={user} notificationCount={notificationCount} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}