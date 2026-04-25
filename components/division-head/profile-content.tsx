'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { changePassword } from '@/app/actions/division-head/change-password'
import { uploadAvatar, removeAvatar } from '@/app/actions/user/avatar'
import {
  Camera,
  Upload,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

interface User {
  id: string
  firstName: string
  middleInitial: string | null
  lastName: string
  email: string
  mobileNumber: string
  division: string | null
  officialStation: string | null
  employmentStatus: string | null
  avatarUrl: string | null
}

const divisionLabels: Record<string, string> = {
  regulatory: 'Regulatory Division',
  laboratory: 'Integrated Laboratory Division',
  research: 'Research Division',
  field_ops: 'Field Operations Division',
  agri_marketing: 'Agribusiness and Marketing Assistance Division',
  engineering: 'Regional Agricultural Engineering Division',
  planning: 'Planning, Monitoring and Evaluation Division',
  info_section: 'Regional Agriculture & Fisheries Information Section',
  admin_finance: 'Administrative & Finance Division',
  procurement: 'Procurement of Goods and Infrastructure',
}

export function ProfileContent({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const fullName = `${user.firstName} ${user.middleInitial ? user.middleInitial + '. ' : ''}${user.lastName}`
  const divisionName = user.division ? divisionLabels[user.division] || user.division : '—'
  const station = user.officialStation || '—'
  const employmentStatus = user.employmentStatus
    ? user.employmentStatus.charAt(0).toUpperCase() + user.employmentStatus.slice(1).toLowerCase()
    : '—'

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      toast.error('File size must be less than 500KB')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }
    setIsUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)
    const result = await uploadAvatar(formData)
    if (result.success && result.avatarUrl) {
      setAvatarUrl(result.avatarUrl)
      toast.success('Profile picture updated')
    } else {
      toast.error(result.error || 'Upload failed')
    }
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    const result = await removeAvatar()
    if (result.success) {
      setAvatarUrl(null)
      toast.success('Profile picture removed')
    } else {
      toast.error(result.error || 'Failed to remove')
    }
    setIsUploading(false)
  }

  const onChangePassword = async (data: z.infer<typeof passwordSchema>) => {
    setIsChangingPassword(true)
    const result = await changePassword(data.currentPassword, data.newPassword)
    if (result.success) {
      toast.success('Password changed successfully')
      reset()
    } else {
      toast.error(result.error || 'Failed to change password')
    }
    setIsChangingPassword(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and account security.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column – Avatar + Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your public avatar displayed across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 h-9 w-9 rounded-full shadow-md bg-background"
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload photo
                    </DropdownMenuItem>
                    {avatarUrl && (
                      <DropdownMenuItem onClick={handleRemoveAvatar} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove photo
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-3">Max 500KB • JPEG, PNG, GIF</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your official contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Mobile Number</p>
                  <p className="font-medium text-foreground">{user.mobileNumber || '—'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Division</p>
                  <p className="font-medium text-foreground">{divisionName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column – Change Password */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Change Password
              </CardTitle>
              <CardDescription>
                Your default password was <strong>DAMIMAROPA</strong>. We strongly recommend updating it to a secure password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onChangePassword)} className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    {...register('currentPassword')}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter a strong password"
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter the new password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto">
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}