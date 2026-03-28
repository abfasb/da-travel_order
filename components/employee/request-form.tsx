'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Users, CalendarDays, FileText, Wallet, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { submitTravelOrder } from '@/app/actions/travelOrder'

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

  // Add employment status to schema so Zod can check it
  employmentStatus: z.string().optional(),

  // Make the array optional initially
  itineraryItems: z.array(
    z.object({
      date: z.string().min(1, 'Date is required'),
      location: z.string().min(1, 'Location is required'),
      activity: z.string().min(1, 'Activity is required'),
      responsiblePerson: z.string().min(1, 'Responsible person is required'),
    })
  ).optional(),

}).refine((data) => {
  if (!data.departureDate || !data.returnDate) return true
  return new Date(data.returnDate) >= new Date(data.departureDate)
}, {
  message: 'Return date cannot be before departure date',
  path: ['returnDate'],
})
.superRefine((data, ctx) => {
  if (data.employmentStatus !== 'PERMANENT') {
    if (!data.itineraryItems || data.itineraryItems.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one itinerary row is required for COS/JO status",
        path: ["itineraryItems", "root"]
      });
    }
  }
})

type FormValues = z.infer<typeof formSchema>

export function RequestForm({ employmentStatus = 'COS' }: { employmentStatus?: string | null }) {
  const isPermanent = employmentStatus === 'PERMANENT'

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      employmentStatus: employmentStatus || 'COS',
      // If permanent, initialize with empty array. Otherwise, 1 blank row.
      itineraryItems: isPermanent ? [] : [{ date: '', location: '', activity: '', responsiblePerson: '' }]
    }
  })

  // Initialize useFieldArray for dynamic rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itineraryItems',
  })

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading('Submitting Travel Order...')

    const result = await submitTravelOrder(data)

    if (result.success) {
      toast.success('Travel order submitted successfully!', { id: toastId })
      reset() 
    } else {
      toast.error(result.error || 'Failed to submit the request.', { id: toastId })
    }
  }

  const ErrorMessage = ({ error }: { error?: { message?: string } }) => (
    error?.message ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null
  )

  return (
    //@ts-ignore
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      
      {/* Hidden input so Zod knows the employment status during submission */}
      <input type="hidden" {...register('employmentStatus')} value={employmentStatus || 'COS'} />

      {/* SECTION 1: Personal Profile */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4" /> Employee Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 lg:col-span-2">
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
          <CalendarDays className="w-4 h-4" /> Schedule & Location
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

      {/* SECTION 3: Dynamic Itinerary Table - ONLY RENDER IF NOT PERMANENT */}
      {!isPermanent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Proposed Itinerary Details
            </h3>
            <button
              type="button"
              onClick={() => append({ date: '', location: '', activity: '', responsiblePerson: '' })}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Date</label>
                  <input
                    type="date"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    {...register(`itineraryItems.${index}.date` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.date} />
                </div>
                
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Naujan, Or. Mindoro"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    {...register(`itineraryItems.${index}.location` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.location} />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Activity</label>
                  <input
                    type="text"
                    placeholder="e.g. Assist in personnel audit"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    {...register(`itineraryItems.${index}.activity` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.activity} />
                </div>

                <div className="md:col-span-3 space-y-1 relative">
                  <label className="text-xs font-semibold text-slate-600">Responsible Person</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Christine Montiano"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/20"
                      {...register(`itineraryItems.${index}.responsiblePerson` as const)}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove Row"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.responsiblePerson} />
                </div>
              </div>
            ))}
            {errors.itineraryItems?.root && (
              <p className="text-red-500 text-sm">{errors.itineraryItems.root.message}</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Details & Purpose */}
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

      {/* SECTION 5: Logistics & Finance */}
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
          disabled={isSubmitting}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Submitting..." : "Submit Travel Order"}
        </button>
      </div>
    </form>
  )
}