'use client'

import { Controller, useForm } from 'react-hook-form'
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

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  division: z.string().min(1, 'Division is required'),
})

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
      password: '',
      division: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    const result = await createUser({
      ...values,
      role: 'DIVISION_HEAD', // fixed role
    })
    if (result.success) {
      toast.success('Division Head created successfully')
      router.push('/hr/users')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to create user')
    }
  }

  const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
    error?.message ? <p className="text-destructive text-xs mt-1">{error.message}</p> : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">First Name</label>
          <Input placeholder="Juan" {...register('firstName')} />
          <ErrorMessage error={errors.firstName} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Last Name</label>
          <Input placeholder="Dela Cruz" {...register('lastName')} />
          <ErrorMessage error={errors.lastName} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Middle Initial</label>
          <Input placeholder="A" {...register('middleInitial')} />
          <ErrorMessage error={errors.middleInitial} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Email</label>
          <Input placeholder="juan@example.com" type="email" {...register('email')} />
          <ErrorMessage error={errors.email} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Mobile Number</label>
          <Input placeholder="09123456789" {...register('mobileNumber')} />
          <ErrorMessage error={errors.mobileNumber} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" {...register('password')} />
          <ErrorMessage error={errors.password} />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Division</label>
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
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Division Head'}
        </Button>
      </div>
    </form>
  )
}