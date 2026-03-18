import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PlaneTakeoff, Briefcase } from 'lucide-react'
import { RequestForm } from '@/components/employee/request-form'

export default async function EmployeeDashboardPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('user_role')?.value

  if (!role || role !== 'STAFF') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">My Workspace</h1>
            <p className="text-emerald-200/80 font-medium tracking-wide">
              Official DA Employee Dashboard
            </p>
          </div>
          <div className="hidden md:flex h-16 w-16 bg-emerald-800 rounded-2xl items-center justify-center border border-emerald-700">
            <Briefcase className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Travel Order Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <PlaneTakeoff className="text-emerald-600 w-6 h-6" />
              File New Travel Order
            </h2>
            <p className="text-slate-500 mt-1">Submit your official itinerary and request for approval.</p>
          </div>

          <div className="p-8">
            <RequestForm />
          </div>
        </div>
      </div>
    </div>
  )
}