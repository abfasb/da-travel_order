'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Users, CalendarDays, FileText, Wallet, PlaneTakeoff } from 'lucide-react'

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  salaryPerMonth: z.string().min(1, 'Salary per month is required'),

  departureDate: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  destinationProvince: z.string().min(1, 'Destination province is required'),
  specificLocation: z.string().min(1, 'Specific location is required'),

  destinationSummary: z.string().min(1, 'Destination summary is required'),
  specificPurpose: z.string().min(1, 'Specific purpose is required'),
  objectives: z.string().min(1, 'Objectives are required'),
  travelDetails: z.string().min(1, 'Travel details are required'),

  meansOfTransport: z.string().min(1, 'Means of transport is required'),
  estimatedExpenses: z.string().min(1, 'Estimated expenses are required'),
  sourceOfFunds: z.string().min(1, 'Source of funds is required'),
  accompanyingPersonnel: z.string().optional(),
}).refine((data) => {
  if (!data.departureDate || !data.returnDate) return true
  return new Date(data.returnDate) >= new Date(data.departureDate)
}, {
  message: 'Return date cannot be before departure date',
  path: ['returnDate'],
})

type FormValues = z.infer<typeof formSchema>

export function RequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    // Send to API here
  }

  // Helper to render error message
  const ErrorMessage = ({ error }: { error?: { message?: string } }) => (
    error?.message ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* SECTION 1: Personal Profile */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4" /> Employee Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Full Name</label>
            <input
              type="text"
              placeholder="Juan Dela Cruz"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('fullName')}
            />
            <ErrorMessage error={errors.fullName} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Position</label>
            <input
              type="text"
              placeholder="Agriculturist II"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('position')}
            />
            <ErrorMessage error={errors.position} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Salary per Month</label>
            <input
              type="text"
              placeholder="₱ 35,000"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('salaryPerMonth')}
            />
            <ErrorMessage error={errors.salaryPerMonth} />
          </div>
        </div>
      </div>

      {/* SECTION 2: Schedule & Location */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Itinerary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Departure Date</label>
            <input
              type="date"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('departureDate')}
            />
            <ErrorMessage error={errors.departureDate} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Return Date</label>
            <input
              type="date"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('returnDate')}
            />
            <ErrorMessage error={errors.returnDate} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Dest. Province</label>
            <input
              type="text"
              placeholder="e.g. Palawan"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('destinationProvince')}
            />
            <ErrorMessage error={errors.destinationProvince} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Specific Location</label>
            <input
              type="text"
              placeholder="e.g. Puerto Princesa City"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('specificLocation')}
            />
            <ErrorMessage error={errors.specificLocation} />
          </div>
        </div>
      </div>

      {/* SECTION 3: Details & Purpose */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4" /> Purpose & Objectives
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Destination Summary</label>
            <input
              type="text"
              placeholder="Brief summary of where you are going"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('destinationSummary')}
            />
            <ErrorMessage error={errors.destinationSummary} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Specific Purpose</label>
            <textarea
              placeholder="State the exact reason for travel..."
              rows={2}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"
              {...register('specificPurpose')}
            ></textarea>
            <ErrorMessage error={errors.specificPurpose} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Objectives</label>
              <textarea
                placeholder="Expected outcomes..."
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"
                {...register('objectives')}
              ></textarea>
              <ErrorMessage error={errors.objectives} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Travel Details (Activities)</label>
              <textarea
                placeholder="Step-by-step activities..."
                rows={3}
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none"
                {...register('travelDetails')}
              ></textarea>
              <ErrorMessage error={errors.travelDetails} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Logistics & Finance */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Logistics & Funding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-semibold text-slate-600">Means of Transportation</label>
            <input
              type="text"
              placeholder="e.g. Official DA Vehicle, Commute, Flight"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('meansOfTransport')}
            />
            <ErrorMessage error={errors.meansOfTransport} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Estimated Expenses</label>
            <input
              type="text"
              placeholder="₱ 0.00"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('estimatedExpenses')}
            />
            <ErrorMessage error={errors.estimatedExpenses} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Source of Funds</label>
            <input
              type="text"
              placeholder="e.g. Division Fund"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('sourceOfFunds')}
            />
            <ErrorMessage error={errors.sourceOfFunds} />
          </div>
          <div className="space-y-1 lg:col-span-4">
            <label className="text-sm font-semibold text-slate-600">Accompanying Personnel (Optional)</label>
            <input
              type="text"
              placeholder="Names of other staff joining you..."
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-emerald-500/20"
              {...register('accompanyingPersonnel')}
            />
            <ErrorMessage error={errors.accompanyingPersonnel} />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Submit Travel Order
        </button>
      </div>
    </form>
  )
}