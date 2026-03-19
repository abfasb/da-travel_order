'use client'

import { useState } from 'react'
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

interface AssignNumberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any | null
}

export default function AssignNumberModal({ open, onOpenChange, order }: AssignNumberModalProps) {
  const [number, setNumber] = useState('')

  const handleAssign = () => {
    // Call server action to update travel order with number
    console.log('Assign number', number, 'to order', order?.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Travel Order Number</DialogTitle>
          <DialogDescription>
            Enter the official travel order number for this request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">
              Number
            </Label>
            <Input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. TO-2026-001"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!number.trim()}>
            Assign Number
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}