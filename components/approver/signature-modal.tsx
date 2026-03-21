// components/approver/signature-modal.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SignatureForm } from './signature-form'
import { PenLine } from 'lucide-react'

interface SignatureModalProps {
  orderId: string
  approvalId: string
  userRole: string
}

export function SignatureModal({ orderId, approvalId, userRole }: SignatureModalProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <PenLine className="h-4 w-4" />
          Sign Travel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Signature</DialogTitle>
          <DialogDescription>
            Please provide your signature and certify the review.
          </DialogDescription>
        </DialogHeader>
        <SignatureForm
          orderId={orderId}
          approvalId={approvalId}
          userRole={userRole}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}