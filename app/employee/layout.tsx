import { Sidebar } from '@/components/employee/sidebar'
import { Navbar } from '@/components/employee/navbar'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-muted/10">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}