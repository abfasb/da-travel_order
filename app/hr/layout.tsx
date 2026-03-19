import { Sidebar } from "@/components/hr/sidebar"
import Navbar from "@/components/hr/navbar"

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/10">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}