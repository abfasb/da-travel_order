'use client'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createUser } from '@/app/actions/hr/users'

const DIVISIONS = [
  { value: 'regulatory', label: 'Regulatory Division' },
  { value: 'laboratory', label: 'Integrated Laboratory Division' },
  { value: 'research', label: 'Research Division' },
  { value: 'field_ops', label: 'Field Operations Division' },
  { value: 'agri_marketing', label: 'Agribusiness and Marketing Assistance Division' },
  { value: 'engineering', label: 'Regional Agricultural Engineering Division' },
  { value: 'planning', label: 'Planning, Monitoring and Evaluation Division' },
  { value: 'info_section', label: 'Regional Agriculture & Fisheries Information Section' },
  { value: 'admin_finance', label: 'Administrative & Finance Division' },
  { value: 'procurement', label: 'Procurement of Goods and Infrastructure' },
] as const

const PROVINCES = [
  'Oriental Mindoro',
  'Occidental Mindoro',
  'Marinduque',
  'Palawan',
  'Romblon',
] as const

const EMPLOYMENT_STATUSES = ['PERMANENT', 'COS', 'JO'] as const

const ROLES = [
  'STAFF',
  'DIVISION_HEAD',
  'APCO',
  'CHIEF_AGRICULTURIST',
  'CHIEF_ADMINISTRATIVE',
  'REGIONAL_EXECUTIVE',
  'HR',
  'ADMIN',
] as const

// Base schema
const baseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  role: z.enum(ROLES),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// @ts-ignore
const staffOrHeadSchema = baseSchema.extend({
// @ts-ignore
  employmentStatus: z.enum(EMPLOYMENT_STATUSES, {
    required_error: 'Employment status is required',
  }),
  division: z.string().min(1, 'Division is required'),
// @ts-ignore
  province: z.enum(PROVINCES, {
    required_error: 'Province is required',
  }),
  officialStation: z.string().min(1, 'Official station is required'),
})

// Other roles do not require these fields
const otherRoleSchema = baseSchema.extend({
  employmentStatus: z.enum(EMPLOYMENT_STATUSES).optional(),
  division: z.string().optional(),
  province: z.enum(PROVINCES).optional(),
  officialStation: z.string().optional(),
})

const formSchema = z.discriminatedUnion('role', [
  z.object({ role: z.literal('STAFF') }).merge(staffOrHeadSchema),
  z.object({ role: z.literal('DIVISION_HEAD') }).merge(staffOrHeadSchema),
  z.object({ role: z.enum(ROLES.filter(r => r !== 'STAFF' && r !== 'DIVISION_HEAD')) }).merge(otherRoleSchema),
])

type FormValues = z.infer<typeof formSchema>

// Official stations for Oriental Mindoro
const ORIENTAL_MINDORO_STATIONS = ['DA Victoria', 'DA Barcenaga', 'DA Calapan']

export default function AddUserForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      email: '',
      mobileNumber: '',
      role: 'STAFF',
      password: '',
      employmentStatus: undefined,
      division: '',
      province: undefined,
      officialStation: '',
    },
  })

  const selectedRole = useWatch({ control, name: 'role' })
  const selectedProvince = useWatch({ control, name: 'province' })
  const requiresStaffFields = selectedRole === 'STAFF' || selectedRole === 'DIVISION_HEAD'

  const onSubmit = async (values: FormValues) => {
    // @ts-ignore
    const result = await createUser(values)
    if (result.success) {
      toast.success('User created successfully')
      router.push('/hr/users')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to create user')
    }
  }

  const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
    error?.message ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">First Name</label>
          <Input placeholder="Juan" {...register('firstName')} />
          <ErrorMessage error={errors.firstName} />
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Last Name</label>
          <Input placeholder="Dela Cruz" {...register('lastName')} />
          <ErrorMessage error={errors.lastName} />
        </div>

        {/* Middle Initial */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Middle Initial</label>
          <Input placeholder="A" {...register('middleInitial')} />
          <ErrorMessage error={errors.middleInitial} />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Email</label>
          <Input placeholder="juan@example.com" type="email" {...register('email')} />
          <ErrorMessage error={errors.email} />
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Mobile Number</label>
          <Input placeholder="09123456789" {...register('mobileNumber')} />
          <ErrorMessage error={errors.mobileNumber} />
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff / Employee</SelectItem>
                  <SelectItem value="DIVISION_HEAD">Division Head</SelectItem>
                  <SelectItem value="APCO">APCO</SelectItem>
                  <SelectItem value="CHIEF_AGRICULTURIST">Chief Agriculturist</SelectItem>
                  <SelectItem value="CHIEF_ADMINISTRATIVE">Chief Administrative Officer</SelectItem>
                  <SelectItem value="REGIONAL_EXECUTIVE">Regional Executive Director</SelectItem>
                  <SelectItem value="HR">HR Officer</SelectItem>
                  <SelectItem value="ADMIN">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage error={errors.role} />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Password</label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          <ErrorMessage error={errors.password} />
        </div>

        {/* Staff/Division Head specific fields */}
        {requiresStaffFields && (
          <>
            {/* Employment Status */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Employment Status</label>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMANENT">Permanent</SelectItem>
                      <SelectItem value="COS">Contract of Service (COS)</SelectItem>
                      <SelectItem value="JO">Job Order (JO)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage error={errors.employmentStatus} />
            </div>

            {/* Division */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Division</label>
              <Controller
                name="division"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVISIONS.map((div) => (
                        <SelectItem key={div.value} value={div.value}>
                          {div.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage error={errors.division} />
            </div>

            {/* Province */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Province</label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setValue('officialStation', '')
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage error={errors.province} />
            </div>

            {/* Official Station */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Official Station</label>
              {selectedProvince === 'Oriental Mindoro' ? (
                <Controller
                  name="officialStation"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORIENTAL_MINDORO_STATIONS.map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input placeholder="Enter official station" {...register('officialStation')} />
              )}
              <ErrorMessage error={errors.officialStation} />
            </div>
          </>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}