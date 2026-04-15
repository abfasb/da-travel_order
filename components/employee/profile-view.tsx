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
  
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
  const fullName = `${user.firstName} ${user.middleInitial ? user.middleInitial + '. ' : ''}${user.lastName}`.trim()

  const formatStatus = (status: string) => {
    if (!status) return ''
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

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
      setUser({ ...user, avatarUrl: result.avatarUrl })
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
      setUser({ ...user, avatarUrl: null })
      toast.success('Profile picture removed')
    } else {
      toast.error(result.error || 'Failed to remove')
    }
    setIsUploading(false)
  }

  const handleSaveProfile = async () => {
    setUser(prev => ({ ...prev, email, mobileNumber })) 
    toast.success('Profile updated')
    setIsEditing(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 p-8 pt-12 gap-8 max-w-7xl mx-auto">
      
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-border/50 shadow-sm bg-card overflow-hidden transition-all hover:shadow-md">
          {/* Refined Cover Banner */}
          <div className="h-32 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 w-full relative">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          </div>
          
          <CardContent className="p-6 pt-0 flex flex-col items-center text-center relative">
            {/* Elevated Avatar */}
            <div className="relative group -mt-16 mb-5">
              <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl bg-muted/50">
                <AvatarImage src={user.avatarUrl || undefined} className="object-cover" />
                <AvatarFallback className="text-3xl font-medium bg-gradient-to-b from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="absolute bottom-1 right-1 p-2.5 bg-background border border-border rounded-full text-foreground shadow-sm hover:bg-muted hover:text-emerald-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload new photo
                  </DropdownMenuItem>
                  {user.avatarUrl && (
                    <DropdownMenuItem onClick={handleRemoveAvatar} className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove photo
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
            
            <div className="space-y-1 w-full">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{fullName}</h2>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400/90 capitalize">{user.division}</p>
            </div>

            {/* Sleeker Status Badges */}
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border border-border/50 transition-colors hover:bg-muted/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">System Role</span>
                </div>
                <span className="text-sm font-bold tracking-wide">{user.role}</span>
              </div>
              
              <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border border-border/50 transition-colors hover:bg-muted/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </div>
                <span className="text-sm font-bold tracking-wide text-foreground">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Detailed Information */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Section 1: Personal Information */}
        <Card className="border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle className="text-xl flex items-center gap-2.5">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Manage your contact details and identity.
                </CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className={`transition-all ${isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
              >
                {isEditing ? (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                ) : (
                  <><Edit2 className="w-4 h-4 mr-2" /> Edit Details</>
                )}
              </Button>
            </div>
          </CardHeader>
          <Separator className="mb-6 opacity-50" />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-muted-foreground/60'}`} />
                  <Input 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 h-11 bg-background transition-all ${
                      !isEditing 
                        ? 'border-transparent shadow-none px-10 text-foreground font-medium disabled:opacity-100 bg-muted/30' 
                        : 'border-border focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500'
                    }`} 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mobile Number
                </Label>
                <div className="relative group">
                  <Phone className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-muted-foreground/60'}`} />
                  <Input 
                    id="phone" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 h-11 bg-background transition-all ${
                      !isEditing 
                        ? 'border-transparent shadow-none px-10 text-foreground font-medium disabled:opacity-100 bg-muted/30' 
                        : 'border-border focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500'
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Changes made here will be applied immediately upon saving.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Employment Details (Locked) */}
        <Card className="border-border/40 shadow-sm bg-card/80 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute top-1/2 -translate-y-1/2 right-10 p-6 opacity-[0.03] pointer-events-none rotate-12">
            <Lock className="w-64 h-64 text-foreground" />
          </div>
          
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-xl flex items-center gap-2.5 text-foreground/80">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  Employment Details
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Official assignment information managed by administration.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-muted/80 text-muted-foreground border-transparent shadow-none font-medium py-1.5 px-3">
                <Lock className="w-3 h-3 mr-1.5" /> Read Only
              </Badge>
            </div>
          </CardHeader>
          <Separator className="mb-6 opacity-30" />
          
          <CardContent className="space-y-8 relative z-10 opacity-80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Building className="w-4 h-4" /> Assigned Division
                </Label>
                <div className="text-foreground font-medium text-lg capitalize px-1">
                  {user.division}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <MapPin className="w-4 h-4" /> Official Station
                </Label>
                <div className="text-foreground font-medium text-lg px-1">
                  {user.officialStation}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider block mb-3 px-1">
                Employment Status
              </Label>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-muted/50 text-foreground border border-border/50 rounded-full font-medium text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {formatStatus(user.employmentStatus)} Employee
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}