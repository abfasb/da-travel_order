'use client'

import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Users, CalendarDays, FileText, Wallet, Plus, Trash2, Pen } from 'lucide-react'
import { toast } from 'sonner'
import { submitTravelOrder } from '@/app/actions/travelOrder'
import { SignatureInput } from './signature-input'

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  salaryPerMonth: z.string().min(1, 'Salary per month is required'),

  departureDate: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  destinationProvince: z.string().min(1, 'Destination province is required'),
  specificLocation: z.string().min(1, 'Specific location is required'),

  destinationSummary: z.string().optional(),
  specificPurpose: z.string().min(1, 'Specific purpose is required'),
  objectives: z.string().min(1, 'Objectives are required'),
  travelDetails: z.string().min(1, 'Travel details are required'),

  meansOfTransport: z.string().min(1, 'Means of transport is required'),
  estimatedExpenses: z.string().min(1, 'Estimated expenses are required'),
  sourceOfFunds: z.string().min(1, 'Source of funds is required'),
  accompanyingPersonnel: z.string().optional(),

  employmentStatus: z.string().optional(),

  itineraryItems: z.array(
    z.object({
      date: z.string().min(1, 'Date is required'),
      location: z.string().min(1, 'Location is required'),
      activity: z.string().min(1, 'Activity is required'),
      responsiblePerson: z.string().min(1, 'Responsible person is required'),
    })
  ).optional(),

  requestorSignature: z.string().optional(),

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
    if (!data.requestorSignature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Signature is required for COS/JO employees",
        path: ["requestorSignature"]
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employmentStatus: employmentStatus || 'COS',
      itineraryItems: isPermanent ? [] : [{ date: '', location: '', activity: '', responsiblePerson: '' }],
      requestorSignature: '',
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itineraryItems',
  })

  const watchedSignature = useWatch({ control, name: 'requestorSignature' })

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
    error?.message ? <p className="text-destructive text-xs mt-1">{error.message}</p> : null
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      
      <input type="hidden" {...register('employmentStatus')} value={employmentStatus || 'COS'} />

      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4" /> Employee Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-semibold text-foreground">Full Name</label>
            <input
              type="text"
              placeholder="Juan Dela Cruz"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('fullName')}
            />
            <ErrorMessage error={errors.fullName} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Position</label>
            <input
              type="text"
              placeholder="Agriculturist II"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('position')}
            />
            <ErrorMessage error={errors.position} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Salary per Month</label>
            <input
              type="text"
              placeholder="₱ 35,000"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('salaryPerMonth')}
            />
            <ErrorMessage error={errors.salaryPerMonth} />
          </div>
        </div>
      </div>

      {/* SECTION 2: Schedule & Location */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> Schedule & Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Departure Date</label>
            <input
              type="date"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('departureDate')}
            />
            <ErrorMessage error={errors.departureDate} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Return Date</label>
            <input
              type="date"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('returnDate')}
            />
            <ErrorMessage error={errors.returnDate} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Dest. Province</label>
            <input
              type="text"
              placeholder="e.g. Palawan"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('destinationProvince')}
            />
            <ErrorMessage error={errors.destinationProvince} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Specific Location</label>
            <input
              type="text"
              placeholder="e.g. Puerto Princesa City"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('specificLocation')}
            />
            <ErrorMessage error={errors.specificLocation} />
          </div>
        </div>
      </div>

      {/* SECTION 3: Itinerary (only for non‑permanent) */}
      {!isPermanent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Proposed Itinerary Details
            </h3>
            <button
              type="button"
              onClick={() => append({ date: '', location: '', activity: '', responsiblePerson: '' })}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl border border-border bg-muted relative">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-foreground">Date</label>
                  <input
                    type="date"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
                    {...register(`itineraryItems.${index}.date` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.date} />
                </div>
                
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Naujan, Or. Mindoro"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
                    {...register(`itineraryItems.${index}.location` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.location} />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-semibold text-foreground">Activity</label>
                  <input
                    type="text"
                    placeholder="e.g. Assist in personnel audit"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
                    {...register(`itineraryItems.${index}.activity` as const)}
                  />
                  <ErrorMessage error={errors?.itineraryItems?.[index]?.activity} />
                </div>

                <div className="md:col-span-3 space-y-1 relative">
                  <label className="text-xs font-semibold text-foreground">Responsible Person</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Christine Montiano"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
                      {...register(`itineraryItems.${index}.responsiblePerson` as const)}
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
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
              <p className="text-destructive text-sm">{errors.itineraryItems.root.message}</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3.5: Signature (only for non‑permanent) */}
      {!isPermanent && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Pen className="w-4 h-4" /> Employee Signature
          </h3>
          <div className="p-4 rounded-xl border border-border bg-muted">
            <SignatureInput
              value={watchedSignature}
              onChange={(val) => setValue('requestorSignature', val)}
            />
            <ErrorMessage error={errors.requestorSignature} />
          </div>
        </div>
      )}

      {/* SECTION 4: Details & Purpose */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4" /> Purpose & Objectives
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Destination Summary (Optional)</label>
            <input
              type="text"
              placeholder="Brief summary of where you are going"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('destinationSummary')}
            />
            <ErrorMessage error={errors.destinationSummary} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Specific Purpose</label>
            <textarea
              placeholder="State the exact reason for travel..."
              rows={2}
              className="w-full p-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 resize-none"
              {...register('specificPurpose')}
            ></textarea>
            <ErrorMessage error={errors.specificPurpose} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Objectives</label>
              <textarea
                placeholder="Expected outcomes..."
                rows={3}
                className="w-full p-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 resize-none"
                {...register('objectives')}
              ></textarea>
              <ErrorMessage error={errors.objectives} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Travel Details (Activities)</label>
              <textarea
                placeholder="Step-by-step activities..."
                rows={3}
                className="w-full p-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 resize-none"
                {...register('travelDetails')}
              ></textarea>
              <ErrorMessage error={errors.travelDetails} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Logistics & Finance */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Logistics & Funding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-semibold text-foreground">Means of Transportation</label>
            <input
              type="text"
              placeholder="e.g. Official DA Vehicle, Commute, Flight"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('meansOfTransport')}
            />
            <ErrorMessage error={errors.meansOfTransport} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Estimated Expenses</label>
            <input
              type="text"
              placeholder="₱ 0.00"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('estimatedExpenses')}
            />
            <ErrorMessage error={errors.estimatedExpenses} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Source of Funds</label>
            <input
              type="text"
              placeholder="e.g. Division Fund"
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('sourceOfFunds')}
            />
            <ErrorMessage error={errors.sourceOfFunds} />
          </div>
          <div className="space-y-1 lg:col-span-4">
            <label className="text-sm font-semibold text-foreground">Accompanying Personnel (Optional)</label>
            <input
              type="text"
              placeholder="Names of other staff joining you..."
              className="w-full h-11 px-4 rounded-xl border border-border bg-muted text-sm focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
              {...register('accompanyingPersonnel')}
            />
            <ErrorMessage error={errors.accompanyingPersonnel} />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-6 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? "Submitting..." : "Submit Travel Order"}
        </button>
      </div>
    </form>
  )
}