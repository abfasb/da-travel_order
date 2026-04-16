'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { requestPasswordReset } from '@/app/actions/auth/request-reset'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    const result = await requestPasswordReset(data.email)
    if (result.success) {
      setIsSubmitted(true)
      toast.success('Reset instructions sent to your email')
    } else {
      toast.error(result.error || 'Something went wrong')
    }
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent password reset instructions to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              Click the link in the email to reset your password. The link expires in 1 hour.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}