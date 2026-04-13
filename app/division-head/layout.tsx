import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DivisionHeadSidebar } from '@/components/division-head/sidebar';
import { DivisionHeadNavbar } from '@/components/division-head/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { prisma } from '@/lib/prisma';

export default async function DivisionHeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'DIVISION_HEAD') {
    redirect('/login');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    include: {
      travelOrder: { select: { travelOrderNumber: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        <DivisionHeadSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <DivisionHeadNavbar
            user={user}
            initialNotifications={notifications}
            unreadCount={unreadCount}
          />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}