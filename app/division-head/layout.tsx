import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DivisionHeadSidebar } from '@/components/division-head/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function DivisionHeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'DIVISION_HEAD') {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <DivisionHeadSidebar user={user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}