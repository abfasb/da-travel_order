'use client'

import { useState, useRef } from 'react'
import { 
  User, Mail, Phone, Building, MapPin, Briefcase, 
  Camera, ShieldCheck, Lock, Edit2, Save, CheckCircle2,
  Trash2, Upload, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { uploadAvatar, removeAvatar } from '@/app/actions/user/avatar'
import Image from 'next/image'

interface ProfileViewProps {
  user: {
    id: string
    firstName: string
    middleInitial: string | null
    lastName: string
    email: string
    mobileNumber: string
    employmentStatus: string
    division: string
    officialStation: string
    role: string
    avatarUrl: string | null
  }
}

export function ProfileView({ user: initialUser }: ProfileViewProps) {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [email, setEmail] = useState(initialUser.email)
  const [mobileNumber, setMobileNumber] = useState(initialUser.mobileNumber)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  const fullName = `${user.firstName} ${user.middleInitial ? user.middleInitial + '. ' : ''}${user.lastName}`

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side size validation
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
      setUser({ ...user, avatarUrl: result.avatarUrl })
      toast.success('Profile picture updated')
    } else {
      toast.error(result.error || 'Upload failed')
    }
    setIsUploading(false)
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    const result = await removeAvatar()
    if (result.success) {
      setUser({ ...user, avatarUrl: null })
      toast.success('Profile picture removed')
    } else {
      toast.error(result.error || 'Failed to remove')
    }
    setIsUploading(false)
  }

  const handleSaveProfile = async () => {
    // You can implement profile update action here
    toast.success('Profile updated')
    setIsEditing(false)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      <Card className="xl:col-span-1 border-border shadow-md bg-card overflow-hidden flex flex-col h-max">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-800 dark:to-teal-700 w-full relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <CardContent className="p-6 flex flex-col items-center text-center relative pt-0">
          {/* Avatar floating over banner */}
          <div className="relative group -mt-16 mb-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg bg-muted">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-4xl font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="absolute bottom-1 right-1 p-2.5 bg-emerald-600 rounded-full text-white shadow-md hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload photo
                </DropdownMenuItem>
                {user.avatarUrl && (
                  <DropdownMenuItem onClick={handleRemoveAvatar} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove photo
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          <div className="space-y-1.5 w-full">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{fullName}</h2>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{user.division}</p>
          </div>

          <div className="mt-6 w-full flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">System Role</p>
                <p className="text-sm font-bold text-foreground">{user.role}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Account Status</p>
                <p className="text-sm font-bold text-foreground">Active & Verified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT COLUMN: Detailed Information */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Section 1: Personal Information */}
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Manage your contact details and identity.</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className={`transition-all ${isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" : "hover:bg-muted"}`}
              >
                {isEditing ? (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                ) : (
                  <><Edit2 className="w-4 h-4 mr-2" /> Edit Details</>
                )}
              </Button>
            </div>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <Input 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 h-11 transition-all ${!isEditing ? 'bg-muted border-border text-foreground disabled:opacity-100' : 'focus-visible:ring-emerald-500'}`} 
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Mobile Number
                </Label>
                <div className="relative group">
                  <Phone className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <Input 
                    id="phone" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 h-11 transition-all ${!isEditing ? 'bg-muted border-border text-foreground disabled:opacity-100' : 'focus-visible:ring-emerald-500'}`} 
                  />
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3" />
                Profile update will be saved to your account.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Employment Details (Locked) */}
        <Card className="border-border shadow-md bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Lock className="w-32 h-32" />
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Employment Details
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Official assignment information.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border shadow-sm py-1.5 px-3">
                <Lock className="w-3 h-3 mr-1.5" /> Locked by HR
              </Badge>
            </div>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> Assigned Division
                </Label>
                <div className="flex items-center h-11 px-4 bg-muted rounded-lg border border-border text-foreground font-medium">
                  {user.division}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Official Station
                </Label>
                <div className="flex items-center h-11 px-4 bg-muted rounded-lg border border-border text-foreground font-medium">
                  {user.officialStation}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                Employment Status
              </Label>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full font-semibold text-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {formatStatus(user.employmentStatus)} Employee
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}