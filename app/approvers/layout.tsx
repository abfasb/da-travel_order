import Navbar from "@/components/hr/navbar"

export default function ApproverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}