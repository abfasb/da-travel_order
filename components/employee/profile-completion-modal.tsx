'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { completeProfile } from '@/app/actions/user/complete-profile'

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

const ORIENTAL_MINDORO_STATIONS = ['DA Victoria', 'DA Barcenaga', 'DA Calapan']

const formSchema = z.object({
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  division: z.string().min(1, 'Division is required'),
  province: z.enum(PROVINCES),
  officialStation: z.string().min(1, 'Official station is required'),
  employmentStatus: z.enum(EMPLOYMENT_STATUSES),
})

type FormValues = z.infer<typeof formSchema>

interface ProfileCompletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onComplete: () => void
}

export function ProfileCompletionModal({
  open,
  onOpenChange,
  userId,
  onComplete,
}: ProfileCompletionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<string>('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: '',
      division: '',
      province: undefined,
      officialStation: '',
      employmentStatus: undefined,
    },
  })

  const watchedProvince = watch('province')

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    const result = await completeProfile(userId, data)
    if (result.success) {
      toast.success('Profile completed successfully!')
      onComplete()
    } else {
      toast.error(result.error || 'Failed to save profile')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide the following information to continue using the Travel Order Management System.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              placeholder="09123456789"
              {...register('mobileNumber')}
            />
            {errors.mobileNumber && (
              <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Controller
              name="division"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your division" />
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
            {errors.division && (
              <p className="text-sm text-destructive">{errors.division.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Employment Status</Label>
            <Controller
              name="employmentStatus"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERMANENT">Permanent</SelectItem>
                    <SelectItem value="COS">Contract of Service (COS)</SelectItem>
                    <SelectItem value="JO">Job Order (JO)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentStatus && (
              <p className="text-sm text-destructive">{errors.employmentStatus.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
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
                    <SelectValue placeholder="Select your province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province && (
              <p className="text-sm text-destructive">{errors.province.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="officialStation">Official Station</Label>
            {watchedProvince === 'Oriental Mindoro' ? (
              <Controller
                name="officialStation"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your station" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIENTAL_MINDORO_STATIONS.map((station) => (
                        <SelectItem key={station} value={station}>{station}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                id="officialStation"
                placeholder="Enter your official station"
                {...register('officialStation')}
              />
            )}
            {errors.officialStation && (
              <p className="text-sm text-destructive">{errors.officialStation.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}