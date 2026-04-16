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
import { Sprout, Leaf, Trees, Mountain, CheckCircle2 } from 'lucide-react'

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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      mobileNumber: '',
      division: '',
      province: undefined,
      officialStation: '',
      employmentStatus: undefined,
    },
  })

  const watchedProvince = watch('province')

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      return 
    }
    onOpenChange(newOpen)
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    const result = await completeProfile(userId, data)
    if (result.success) {
      toast.success('Profile completed successfully!', {
        icon: <CheckCircle2 className="text-emerald-500" />,
      })
      onComplete()
    } else {
      toast.error(result.error || 'Failed to save profile')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[93vh] overflow-y-none p-0 gap-0 border-0 shadow-2xl">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-green-800 to-emerald-900">
            <Sprout className="absolute -top-4 -left-4 h-24 w-24 text-white/5 rotate-12" />
            <Leaf className="absolute top-8 right-12 h-16 w-16 text-white/5 -rotate-45" />
            <Trees className="absolute bottom-0 left-1/2 h-20 w-20 text-white/5 -translate-x-1/2" />
            <Mountain className="absolute -bottom-8 -right-8 h-32 w-32 text-white/5" />
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          </div>
          
          <div className="relative z-10 px-6 pt-8 pb-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">
                Complete Your Profile
              </DialogTitle>
            </div>
            <DialogDescription className="text-emerald-100">
              Welcome to the Department of Agriculture Travel Order System. Please provide the following information to get started.
            </DialogDescription>
          </div>
          
          <div className="relative h-6 bg-white dark:bg-gray-950" 
               style={{ clipPath: 'ellipse(70% 100% at 50% 0%)' }} />
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="flex items-center gap-1">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="mobileNumber"
                  placeholder="0912 345 6789"
                  className="pl-10"
                  {...register('mobileNumber')}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+63</span>
              </div>
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
              )}
            </div>

            {/* Division */}
            <div className="space-y-2">
              <Label htmlFor="division" className="flex items-center gap-1">
                Division <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="division"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
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

            {/* Employment Status */}
            <div className="space-y-2">
              <Label htmlFor="employmentStatus" className="flex items-center gap-1">
                Employment Status <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
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

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province" className="flex items-center gap-1">
                Province <span className="text-red-500">*</span>
              </Label>
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
                    <SelectTrigger className="w-full">
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

            {/* Official Station */}
            <div className="space-y-2">
              <Label htmlFor="officialStation" className="flex items-center gap-1">
                Official Station <span className="text-red-500">*</span>
              </Label>
              {watchedProvince === 'Oriental Mindoro' ? (
                <Controller
                  name="officialStation"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
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

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <span className="text-red-500">*</span> Required fields
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !isValid} 
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold py-6 text-base shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Complete Profile
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}