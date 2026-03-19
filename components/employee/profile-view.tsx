'use client'

import { useState } from 'react'
import { 
  User, Mail, Phone, Building, MapPin, Briefcase, 
  Camera, ShieldCheck, Lock, Edit2, Save, CheckCircle2 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProfileViewProps {
  user: {
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    email: string;
    mobileNumber: string;
    employmentStatus: string;
    division: string;
    officialStation: string;
    role: string;
  }
}

export function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  const fullName = `${user.firstName} ${user.middleInitial ? user.middleInitial + '. ' : ''}${user.lastName}`

  // Format the employment status to look nice (e.g., "PERMANENT" -> "Permanent")
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: Profile Card */}
      <Card className="xl:col-span-1 border-slate-200 shadow-md bg-white overflow-hidden flex flex-col h-max">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 w-full relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <CardContent className="p-6 flex flex-col items-center text-center relative pt-0">
          {/* Avatar floating over banner */}
          <div className="relative group -mt-16 mb-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
              <AvatarFallback className="text-4xl font-bold bg-emerald-50 text-emerald-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-1 right-1 p-2.5 bg-emerald-600 rounded-full text-white shadow-md hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1.5 w-full">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{fullName}</h2>
            <p className="text-sm font-medium text-emerald-600">{user.division}</p>
          </div>

          <div className="mt-6 w-full flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Role</p>
                <p className="text-sm font-bold text-slate-900">{user.role}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Account Status</p>
                <p className="text-sm font-bold text-slate-900">Active & Verified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT COLUMN: Detailed Information */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Section 1: Personal Information */}
        <Card className="border-slate-200 shadow-md bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                  <User className="w-5 h-5 text-emerald-600" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm">Manage your contact details and identity.</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => setIsEditing(!isEditing)}
                className={`transition-all ${isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" : "hover:bg-slate-50"}`}
              >
                {isEditing ? (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                ) : (
                  <><Edit2 className="w-4 h-4 mr-2" /> Edit Details</>
                )}
              </Button>
            </div>
          </CardHeader>
          <Separator className="mx-6 w-auto mb-6" />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <Input 
                    id="email" 
                    defaultValue={user.email} 
                    disabled={!isEditing}
                    className={`pl-10 h-11 transition-all ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 disabled:opacity-100' : 'focus-visible:ring-emerald-500'}`} 
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number
                </Label>
                <div className="relative group">
                  <Phone className={`absolute left-3.5 top-3 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <Input 
                    id="phone" 
                    defaultValue={user.mobileNumber} 
                    disabled={!isEditing}
                    className={`pl-10 h-11 transition-all ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 disabled:opacity-100' : 'focus-visible:ring-emerald-500'}`} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Employment Details (Locked) */}
        <Card className="border-slate-200 shadow-md bg-white relative overflow-hidden">
          {/* Subtle lock pattern background indicator */}
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Lock className="w-32 h-32" />
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Employment Details
                </CardTitle>
                <CardDescription className="text-sm">Official assignment information.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 shadow-sm py-1.5 px-3">
                <Lock className="w-3 h-3 mr-1.5" /> Locked by HR
              </Badge>
            </div>
          </CardHeader>
          <Separator className="mx-6 w-auto mb-6" />
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" /> Assigned Division
                </Label>
                <div className="flex items-center h-11 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium">
                  {user.division}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> Official Station
                </Label>
                <div className="flex items-center h-11 px-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium">
                  {user.officialStation}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Employment Status
              </Label>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold text-sm shadow-sm">
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