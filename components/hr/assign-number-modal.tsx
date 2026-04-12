'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { toast } from 'sonner'

const formSchema = z.object({
  travelOrderNumber: z.string().min(1, 'Travel order number is required'),
})

interface AssignNumberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: { id: string } | null
  onSuccess?: (orderId: string, travelOrderNumber: string) => void
}

export default function AssignNumberModal({
  open,
  onOpenChange,
  order,
  onSuccess,
}: AssignNumberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travelOrderNumber: generateSuggestedNumber(),
    },
  })

  function generateSuggestedNumber() {
    const year = new Date().getFullYear()
    return `TO-${year}-`
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!order) return

    setIsSubmitting(true)
    
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Travel Order Number</DialogTitle>
          <DialogDescription>
            Enter the official travel order number for this request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="travelOrderNumber">Travel Order Number</Label>
              <Input
                id="travelOrderNumber"
                placeholder="e.g., TO-2026-001"
                {...register('travelOrderNumber')}
              />
              {errors.travelOrderNumber && (
                <p className="text-sm text-red-500">{errors.travelOrderNumber.message}</p>
              )}
              <p className="text-xs text-slate-500">
                Suggested format: TO-YYYY-XXX
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Number'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}