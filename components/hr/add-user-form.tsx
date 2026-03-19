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

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleInitial: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  role: z.enum([
    'APCO',
    'CHIEF_AGRICULTURIST',
    'CHIEF_ADMINISTRATIVE',
    'REGIONAL_EXECUTIVE',
  ]),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function AddUserForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      email: '',
      mobileNumber: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createUser(values)
    if (result.success) {
      toast.success('User created successfully')
      router.push('/hr/users')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to create user')
    }
  }

  const ErrorMessage = ({ error }: { error?: { message?: string } }) => (
    error?.message ? <p className="text-red-500 text-xs mt-1">{error.message}</p> : null
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">First Name</label>
          <Input placeholder="Juan" {...register('firstName')} className="w-full" />
          <ErrorMessage error={errors.firstName} />
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Last Name</label>
          <Input placeholder="Dela Cruz" {...register('lastName')} className="w-full" />
          <ErrorMessage error={errors.lastName} />
        </div>

        {/* Middle Initial */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Middle Initial</label>
          <Input placeholder="A" {...register('middleInitial')} className="w-full" />
          <ErrorMessage error={errors.middleInitial} />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Email</label>
          <Input placeholder="juan@example.com" type="email" {...register('email')} className="w-full" />
          <ErrorMessage error={errors.email} />
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Mobile Number</label>
          <Input placeholder="09123456789" {...register('mobileNumber')} className="w-full" />
          <ErrorMessage error={errors.mobileNumber} />
        </div>

        {/* Role (only approvers) */}
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
          <Input type="password" placeholder="••••••••" {...register('password')} className="w-full" />
          <ErrorMessage error={errors.password} />
        </div>
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