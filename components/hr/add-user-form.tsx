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

// Division choices from spec
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

// Only these roles can be created by HR
const ALLOWED_ROLES = [
  'DIVISION_HEAD',
  'APCO',
  'CHIEF_AGRICULTURIST',
  'CHIEF_ADMINISTRATIVE',
  'REGIONAL_EXECUTIVE',
] as const

// Base schema (common fields)
const baseSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  role: z.enum(ALLOWED_ROLES),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Division Head requires division
const divisionHeadSchema = baseSchema.extend({
  role: z.literal('DIVISION_HEAD'),
  division: z.string().min(1, 'Division is required'),
})

// Approvers have no extra fields
const approverSchema = baseSchema.extend({
  role: z.enum(['APCO', 'CHIEF_AGRICULTURIST', 'CHIEF_ADMINISTRATIVE', 'REGIONAL_EXECUTIVE']),
  division: z.string().optional(),
})

const formSchema = z.discriminatedUnion('role', [
  divisionHeadSchema,
  approverSchema,
])

type FormValues = z.infer<typeof formSchema>

export default function AddUserForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      email: '',
      mobileNumber: '',
      role: 'DIVISION_HEAD',
      password: '',
      division: '',
    },
  })

  const selectedRole = useWatch({ control, name: 'role' })
  const showDivisionField = selectedRole === 'DIVISION_HEAD'

  const onSubmit = async (values: FormValues) => {
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
                  <SelectItem value="DIVISION_HEAD">Division Head</SelectItem>
                  <SelectItem value="APCO">APCO</SelectItem>
                  <SelectItem value="CHIEF_AGRICULTURIST">Chief Agriculturist</SelectItem>
                  <SelectItem value="CHIEF_ADMINISTRATIVE">Chief Administrative Officer</SelectItem>
                  <SelectItem value="REGIONAL_EXECUTIVE">Regional Executive Director</SelectItem>
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

        {/* Division - only for Division Head */}
        {showDivisionField && (
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