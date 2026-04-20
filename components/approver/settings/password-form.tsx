'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updatePassword } from '@/app/actions/update-password'
import { CheckCircle2, AlertTriangle, Lock, Loader2, KeyRound } from 'lucide-react'

export function PasswordForm({ isDefaultPassword }: { isDefaultPassword?: boolean }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const result = await updatePassword(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' })
      setTimeout(() => {
        router.push('/logout')
      }, 2000)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update password. Please try again.' })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
      <CardHeader className="bg-muted/30 border-b pb-6">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Change Password</CardTitle>
        </div>
        <CardDescription className="pt-1.5">
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          
          {isDefaultPassword && !message && (
            <Alert className="bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20 mb-6">
              <AlertTriangle className="h-4 w-4 stroke-amber-600 dark:stroke-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">Action Required</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400/90 mt-1">
                You are currently using the system's default password. For security reasons, you must change it immediately.
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert 
              className={`mb-6 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-800 dark:text-red-400 border-red-500/20'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 stroke-emerald-600 dark:stroke-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 stroke-red-600 dark:stroke-red-400" />
              )}
              <AlertDescription className="font-medium ml-1">
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="Enter your current password"
                  className="pl-9 bg-background focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  className="pl-9 bg-background focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  className="pl-9 bg-background focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-muted/10 border-t px-6 py-4">
          <Button 
            type="submit" 
            className="w-full sm:w-auto ml-auto font-medium shadow-sm transition-all" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Security...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}